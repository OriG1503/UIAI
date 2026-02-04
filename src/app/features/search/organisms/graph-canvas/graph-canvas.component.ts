import {
  Component,
  input,
  output,
  inject,
  OnDestroy,
  effect,
  untracked,
  ElementRef,
  NgZone,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import Graph from 'graphology';
import Sigma from 'sigma';
import { createNodeBorderProgram } from '@sigma/node-border';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import { GraphData } from '../../types/graph-data.type';
import { GraphSelection } from '../../types/graph-selection.type';
import {
  NODE_SIZE_MIN,
  NODE_SIZE_MAX,
  EDGE_SIZE_MIN,
  EDGE_SIZE_MAX,
  NODE_COLOR_DEFAULT,
  NODE_COLOR_SELECTED,
  NODE_BORDER_RATIO,
  EDGE_COLOR_DEFAULT,
  EDGE_COLOR_SELECTED,
  LABEL_COLOR_DEFAULT,
  LABEL_RENDERED_SIZE_THRESHOLD,
  LABEL_CLICK_RADIUS,
  FORCEATLAS2_ITERATIONS,
  FORCEATLAS2_SETTINGS
} from '../../constants/graph.constants';

const BorderedNodeProgram = createNodeBorderProgram({
  borders: [
    {
      size: { value: NODE_BORDER_RATIO },
      color: { attribute: 'borderColor' }
    },
    {
      size: { fill: true },
      color: { attribute: 'color' }
    }
  ]
});

@Component({
  selector: 'app-graph-canvas',
  standalone: true,
  templateUrl: './graph-canvas.component.html',
  styleUrl: './graph-canvas.component.scss'
})
export class GraphCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sigmaContainer', { static: true }) private _containerRef!: ElementRef<HTMLDivElement>;

  $graphData = input<GraphData | null>(null, { alias: 'graphData' });
  $selection = input<GraphSelection>({ type: 'none' }, { alias: 'selection' });
  $visibleNodes = input<Set<string>>(new Set(), { alias: 'visibleNodes' });

  nodeClick = output<string>();
  edgeClick = output<{ source: string; target: string }>();
  stageClick = output<void>();

  private _ngZone = inject(NgZone);
  private _graph: Graph | null = null;
  private _sigma: Sigma | null = null;
  private _isInitialized = false;

  constructor() {
    effect(() => {
      const data = this.$graphData();
      if (!this._isInitialized || !data) {
        return;
      }
      this._buildGraph(data);
    });

    effect(() => {
      const selection = this.$selection();
      const visibleNodes = this.$visibleNodes();
      if (!this._isInitialized || !this._sigma || !this._graph) {
        return;
      }
      this._applyVisualState(selection, visibleNodes);
    });
  }

  ngAfterViewInit(): void {
    this._isInitialized = true;
    const data = this.$graphData();
    if (data) {
      this._buildGraph(data);
    }
  }

  ngOnDestroy(): void {
    this._sigma?.kill();
    this._sigma = null;
    this._graph = null;
  }

  private _buildGraph(data: GraphData): void {
    this._sigma?.kill();
    this._graph = new Graph();

    const maxMailCount = Math.max(...Array.from(data.nodes.values()).map((n) => n.mailCount), 1);

    data.nodes.forEach((node) => {
      const sizeRatio = node.mailCount / maxMailCount;
      const size = NODE_SIZE_MIN + sizeRatio * (NODE_SIZE_MAX - NODE_SIZE_MIN);
      this._graph!.addNode(node.email, {
        label: node.email,
        size,
        color: NODE_COLOR_DEFAULT,
        borderColor: NODE_COLOR_DEFAULT,
        type: 'bordered',
        x: Math.random() * 100,
        y: Math.random() * 100,
        mailCount: node.mailCount
      });
    });

    const maxEdgeCount = data.maxEdgeCount || 1;
    data.edges.forEach((edge) => {
      const sizeRatio = edge.mailCount / maxEdgeCount;
      const size = EDGE_SIZE_MIN + sizeRatio * (EDGE_SIZE_MAX - EDGE_SIZE_MIN);
      if (this._graph!.hasNode(edge.sourceEmail) && this._graph!.hasNode(edge.targetEmail)) {
        this._graph!.addEdge(edge.sourceEmail, edge.targetEmail, {
          size,
          color: EDGE_COLOR_DEFAULT,
          mailCount: edge.mailCount
        });
      }
    });

    this._ngZone.runOutsideAngular(() => {
      forceAtlas2.assign(this._graph!, {
        iterations: FORCEATLAS2_ITERATIONS,
        settings: FORCEATLAS2_SETTINGS
      });
    });

    this._ngZone.runOutsideAngular(() => {
      this._sigma = new Sigma(this._graph!, this._containerRef.nativeElement, {
        renderEdgeLabels: false,
        defaultNodeColor: NODE_COLOR_DEFAULT,
        defaultEdgeColor: EDGE_COLOR_DEFAULT,
        defaultNodeType: 'bordered',
        nodeProgramClasses: {
          bordered: BorderedNodeProgram
        },
        labelSize: 12,
        labelColor: { color: LABEL_COLOR_DEFAULT },
        labelRenderedSizeThreshold: LABEL_RENDERED_SIZE_THRESHOLD,
        defaultDrawNodeHover: () => {}
      });

      this._sigma.on('clickNode', ({ node }) => {
        this._ngZone.run(() => this.nodeClick.emit(node));
      });

      this._sigma.on('clickEdge', ({ edge }) => {
        this._ngZone.run(() => {
          const source = this._graph!.source(edge);
          const target = this._graph!.target(edge);
          this.edgeClick.emit({ source, target });
        });
      });

      this._sigma.on('clickStage', ({ event }) => {
        const nearNode = this._findNodeNearViewport(event.x, event.y);
        if (nearNode) {
          this._ngZone.run(() => this.nodeClick.emit(nearNode));
        } else {
          this._ngZone.run(() => this.stageClick.emit());
        }
      });

      this._sigma.on('enterNode', () => {
        this._containerRef.nativeElement.style.cursor = 'pointer';
      });

      this._sigma.on('leaveNode', () => {
        this._containerRef.nativeElement.style.cursor = 'default';
      });

      const selection = untracked(() => this.$selection());
      const visibleNodes = untracked(() => this.$visibleNodes());
      this._applyVisualState(selection, visibleNodes);
    });
  }

  private _applyVisualState(selection: GraphSelection, visibleNodes: Set<string>): void {
    if (!this._sigma || !this._graph) {
      return;
    }

    const selectedNeighbors = new Set<string>();
    if (selection.type === 'node' && selection.nodeEmail) {
      if (this._graph.hasNode(selection.nodeEmail)) {
        this._graph.neighbors(selection.nodeEmail).forEach((n) => selectedNeighbors.add(n));
      }
    }

    this._graph.updateEachNodeAttributes((node, attr) => {
      if (selection.type === 'none') {
        return { ...attr, color: NODE_COLOR_DEFAULT, borderColor: NODE_COLOR_DEFAULT };
      }

      if (selection.type === 'node') {
        if (node === selection.nodeEmail) {
          return { ...attr, color: NODE_COLOR_SELECTED, borderColor: NODE_COLOR_SELECTED };
        }
        if (selectedNeighbors.has(node)) {
          return { ...attr, color: NODE_COLOR_DEFAULT, borderColor: NODE_COLOR_SELECTED };
        }
        return { ...attr, color: NODE_COLOR_DEFAULT, borderColor: NODE_COLOR_DEFAULT };
      }

      if (selection.type === 'edge') {
        const isEndpoint = node === selection.edgeSourceEmail || node === selection.edgeTargetEmail;
        if (isEndpoint) {
          return { ...attr, color: NODE_COLOR_SELECTED, borderColor: NODE_COLOR_SELECTED };
        }
        return { ...attr, color: NODE_COLOR_DEFAULT, borderColor: NODE_COLOR_DEFAULT };
      }

      return attr;
    });

    this._graph.updateEachEdgeAttributes((_edge, attr, source, target) => {
      if (selection.type === 'none') {
        return { ...attr, color: EDGE_COLOR_DEFAULT };
      }

      if (selection.type === 'node') {
        const isConnected = source === selection.nodeEmail || target === selection.nodeEmail;
        return { ...attr, color: isConnected ? EDGE_COLOR_SELECTED : EDGE_COLOR_DEFAULT };
      }

      if (selection.type === 'edge') {
        const isSelected =
          (source === selection.edgeSourceEmail && target === selection.edgeTargetEmail) ||
          (source === selection.edgeTargetEmail && target === selection.edgeSourceEmail);
        return { ...attr, color: isSelected ? EDGE_COLOR_SELECTED : EDGE_COLOR_DEFAULT };
      }

      return attr;
    });

    this._sigma.setSetting('nodeReducer', (node, data) => {
      if (!visibleNodes.has(node)) {
        return { ...data, hidden: true };
      }
      return data;
    });

    this._sigma.setSetting('edgeReducer', (edge, data) => {
      const source = this._graph!.source(edge);
      const target = this._graph!.target(edge);
      if (!visibleNodes.has(source) || !visibleNodes.has(target)) {
        return { ...data, hidden: true };
      }
      return data;
    });

    this._sigma.refresh();
  }

  private _findNodeNearViewport(viewportX: number, viewportY: number): string | null {
    if (!this._sigma || !this._graph) {
      return null;
    }

    const visibleNodes = this.$visibleNodes();
    let closestNode: string | null = null;
    let closestDist = Infinity;

    this._graph.forEachNode((node, attrs) => {
      if (!visibleNodes.has(node)) {
        return;
      }
      const nodeViewport = this._sigma!.graphToViewport({ x: attrs['x'], y: attrs['y'] });
      const dist = Math.sqrt(
        Math.pow(viewportX - nodeViewport.x, 2) + Math.pow(viewportY - nodeViewport.y, 2)
      );
      if (dist < LABEL_CLICK_RADIUS && dist < closestDist) {
        closestDist = dist;
        closestNode = node;
      }
    });

    return closestNode;
  }
}
