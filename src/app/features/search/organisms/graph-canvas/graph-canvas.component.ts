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
import { Settings } from 'sigma/settings';
import { NodeDisplayData, PartialButFor } from 'sigma/types';
import { createNodeBorderProgram } from '@sigma/node-border';
import { EdgeCurvedArrowProgram, indexParallelEdgesIndex } from '@sigma/edge-curve';
import { GraphData } from '../../types/graph-data.type';
import { GraphSelection } from '../../types/graph-selection.type';
import { GRAPH_TRANSLATIONS } from '../../translations/graph.translations';
import { IconComponent } from '../../../../shared/atoms/icon/icon.component';
import {
  NODE_SIZE_MIN,
  NODE_SIZE_MAX,
  EDGE_SIZE_MIN,
  EDGE_SIZE_MAX,
  NODE_COLOR_DEFAULT,
  NODE_COLOR_SELECTED,
  NODE_COLOR_DIMMED,
  NODE_COLOR_HOVER,
  NODE_COLOR_WHITE,
  NODE_BORDER_RATIO,
  NODE_WHITE_GAP_RATIO,
  EDGE_COLOR_DEFAULT,
  EDGE_COLOR_SELECTED,
  EDGE_COLOR_DIMMED,
  EDGE_COLOR_HOVER,
  LABEL_COLOR,
  LABEL_COLOR_DIMMED,
  LABEL_FONT_FAMILY,
  LABEL_FONT_SIZE,
  LABEL_STROKE_WIDTH,
  LABEL_STROKE_COLOR,
  LABEL_RENDERED_SIZE_THRESHOLD,
  LABEL_CLICK_RADIUS,
  EDGE_LABEL_ZOOM_THRESHOLD,
  ICON_COLOR_DEFAULT
} from '../../constants/graph.constants';

const BorderedNodeProgram = createNodeBorderProgram({
  borders: [
    {
      size: { value: NODE_WHITE_GAP_RATIO },
      color: { value: NODE_COLOR_WHITE }
    },
    {
      size: { value: NODE_BORDER_RATIO },
      color: { attribute: 'borderColor' }
    },
    {
      size: { value: NODE_WHITE_GAP_RATIO },
      color: { value: NODE_COLOR_WHITE }
    },
    {
      size: { fill: true },
      color: { attribute: 'color' }
    }
  ]
});

const ENVELOPE_ICON_SVG = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${ICON_COLOR_DEFAULT}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`)}`;

const ENVELOPE_ICON_DIMMED_SVG = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`)}`;

const envelopeImage = new Image();
envelopeImage.src = ENVELOPE_ICON_SVG;

const envelopeImageDimmed = new Image();
envelopeImageDimmed.src = ENVELOPE_ICON_DIMMED_SVG;

let sigmaInstanceForRefresh: Sigma | null = null;
envelopeImage.onload = () => {
  sigmaInstanceForRefresh?.refresh();
};

const drawEnvelopeIcon = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  isDimmed: boolean = false
): void => {
  const iconSize = size * 0.9;
  const img = isDimmed ? envelopeImageDimmed : envelopeImage;
  if (img.complete) {
    context.drawImage(img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
  }
};

const drawCustomLabel = (
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, 'x' | 'y' | 'size' | 'label' | 'color'>,
  _settings: Settings
): void => {
  if (!data.label) {
    return;
  }

  const size = data.size;
  const x = data.x;
  const y = data.y;
  const isDimmed = data.color === NODE_COLOR_DIMMED;

  drawEnvelopeIcon(context, x, y, size, isDimmed);

  const fontSize = LABEL_FONT_SIZE;
  const labelY = y + size + fontSize * 0.4;
  const labelColor = isDimmed ? LABEL_COLOR_DIMMED : LABEL_COLOR;

  context.font = `400 ${fontSize}px ${LABEL_FONT_FAMILY}, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'top';

  context.strokeStyle = LABEL_STROKE_COLOR;
  context.lineWidth = LABEL_STROKE_WIDTH;
  context.lineJoin = 'round';
  context.miterLimit = 2;
  context.strokeText(data.label, x, labelY);

  context.fillStyle = labelColor;
  context.fillText(data.label, x, labelY);
};

@Component({
  selector: 'app-graph-canvas',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './graph-canvas.component.html',
  styleUrl: './graph-canvas.component.scss'
})
export class GraphCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sigmaContainer', { static: true }) private _containerRef!: ElementRef<HTMLDivElement>;

  $graphData = input<GraphData | null>(null, { alias: 'graphData' });
  $positions = input<Record<string, { x: number; y: number }>>({}, { alias: 'positions' });
  $selection = input<GraphSelection>({ type: 'none' }, { alias: 'selection' });
  $visibleNodes = input<Set<string>>(new Set(), { alias: 'visibleNodes' });

  nodeClick = output<string>();
  edgeClick = output<{ source: string; target: string }>();
  stageClick = output<void>();

  private _ngZone = inject(NgZone);
  private _graph: Graph | null = null;
  private _sigma: Sigma | null = null;
  private _isInitialized = false;
  private _isDragging = false;
  private _draggedNode: string | null = null;
  private _hoveredNode: string | null = null;
  private _hoveredEdge: string | null = null;

  readonly translations = GRAPH_TRANSLATIONS;

  constructor() {
    effect(() => {
      const data = this.$graphData();
      const positions = this.$positions();
      if (!this._isInitialized || !data) {
        return;
      }
      this._buildGraph(data, positions);
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
    const positions = this.$positions();
    if (data) {
      this._buildGraph(data, positions);
    }
  }

  ngOnDestroy(): void {
    this._sigma?.kill();
    this._sigma = null;
    this._graph = null;
    sigmaInstanceForRefresh = null;
  }

  private _buildGraph(data: GraphData, positions: Record<string, { x: number; y: number }>): void {
    this._sigma?.kill();
    this._graph = new Graph();

    const maxMailCount = Math.max(...Array.from(data.nodes.values()).map((n) => n.mailCount), 1);

    data.nodes.forEach((node) => {
      const sizeRatio = node.mailCount / maxMailCount;
      const size = NODE_SIZE_MIN + sizeRatio * (NODE_SIZE_MAX - NODE_SIZE_MIN);
      const pos = positions[node.email];
      this._graph!.addNode(node.email, {
        label: node.email,
        size,
        color: NODE_COLOR_DEFAULT,
        borderColor: NODE_COLOR_DEFAULT,
        type: 'bordered',
        x: pos?.x ?? Math.random() * 100,
        y: pos?.y ?? Math.random() * 100,
        mailCount: node.mailCount
      });
    });

    const maxEdgeCount = data.maxEdgeCount || 1;
    data.edges.forEach((edge) => {
      const sizeRatio = edge.mailCount / maxEdgeCount;
      const size = EDGE_SIZE_MIN + sizeRatio * (EDGE_SIZE_MAX - EDGE_SIZE_MIN);
      if (this._graph!.hasNode(edge.sourceEmail) && this._graph!.hasNode(edge.targetEmail)) {
        this._graph!.addDirectedEdge(edge.sourceEmail, edge.targetEmail, {
          size,
          color: EDGE_COLOR_DEFAULT,
          mailCount: edge.mailCount,
          label: String(edge.mailCount)
        });
      }
    });

    indexParallelEdgesIndex(this._graph!, {
      edgeIndexAttribute: 'parallelIndex',
      edgeMinIndexAttribute: 'parallelMinIndex',
      edgeMaxIndexAttribute: 'parallelMaxIndex'
    });

    this._ngZone.runOutsideAngular(() => {
      this._sigma = new Sigma(this._graph!, this._containerRef.nativeElement, {
        renderEdgeLabels: false,
        enableEdgeEvents: true,
        defaultNodeColor: NODE_COLOR_DEFAULT,
        defaultEdgeColor: EDGE_COLOR_DEFAULT,
        defaultNodeType: 'bordered',
        defaultEdgeType: 'curvedArrow',
        nodeProgramClasses: {
          bordered: BorderedNodeProgram
        },
        edgeProgramClasses: {
          curvedArrow: EdgeCurvedArrowProgram
        },
        labelRenderedSizeThreshold: LABEL_RENDERED_SIZE_THRESHOLD,
        labelDensity: Infinity,
        labelGridCellSize: 1,
        edgeLabelSize: 10,
        edgeLabelColor: { color: LABEL_COLOR },
        defaultDrawNodeLabel: drawCustomLabel,
        defaultDrawNodeHover: drawCustomLabel
      });

      sigmaInstanceForRefresh = this._sigma;

      this._sigma.on('downNode', ({ node, event }) => {
        this._isDragging = true;
        this._draggedNode = node;
        this._sigma!.getCamera().disable();
        event.original.preventDefault();
        event.original.stopPropagation();
      });

      this._sigma.getMouseCaptor().on('mousemovebody', (event) => {
        if (!this._isDragging || !this._draggedNode || !this._sigma || !this._graph) {
          return;
        }

        const pos = this._sigma.viewportToGraph(event);
        this._graph.setNodeAttribute(this._draggedNode, 'x', pos.x);
        this._graph.setNodeAttribute(this._draggedNode, 'y', pos.y);
      });

      this._sigma.getMouseCaptor().on('mouseup', () => {
        if (this._isDragging) {
          this._isDragging = false;
          this._draggedNode = null;
          this._sigma?.getCamera().enable();
        }
      });

      this._sigma.on('clickNode', ({ node }) => {
        if (!this._isDragging) {
          this._ngZone.run(() => this.nodeClick.emit(node));
        }
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

      this._sigma.on('enterNode', ({ node }) => {
        this._containerRef.nativeElement.style.cursor = 'grab';
        this._hoveredNode = node;
        this._applyHoverState(node);
      });

      this._sigma.on('leaveNode', () => {
        this._containerRef.nativeElement.style.cursor = 'default';
        this._hoveredNode = null;
        this._clearHoverState();
      });

      this._sigma.on('enterEdge', ({ edge }) => {
        this._containerRef.nativeElement.style.cursor = 'pointer';
        this._hoveredEdge = edge;
        this._applyEdgeHoverState(edge);
      });

      this._sigma.on('leaveEdge', () => {
        this._containerRef.nativeElement.style.cursor = 'default';
        this._hoveredEdge = null;
        this._clearHoverState();
      });

      this._sigma.getCamera().on('updated', () => {
        if (!this._sigma) {
          return;
        }
        const ratio = this._sigma.getCamera().ratio;
        const shouldRenderEdgeLabels = ratio < 1 / EDGE_LABEL_ZOOM_THRESHOLD;
        this._sigma.setSetting('renderEdgeLabels', shouldRenderEdgeLabels);
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
        return { ...attr, color: NODE_COLOR_DIMMED, borderColor: NODE_COLOR_DIMMED };
      }

      if (selection.type === 'edge') {
        const isEndpoint = node === selection.edgeSourceEmail || node === selection.edgeTargetEmail;
        if (isEndpoint) {
          return { ...attr, color: NODE_COLOR_DEFAULT, borderColor: NODE_COLOR_SELECTED };
        }
        return { ...attr, color: NODE_COLOR_DIMMED, borderColor: NODE_COLOR_DIMMED };
      }

      return attr;
    });

    this._graph.updateEachEdgeAttributes((_edge, attr, source, target) => {
      if (selection.type === 'none') {
        return { ...attr, color: EDGE_COLOR_DEFAULT };
      }

      if (selection.type === 'node') {
        const isConnected = source === selection.nodeEmail || target === selection.nodeEmail;
        return { ...attr, color: isConnected ? EDGE_COLOR_SELECTED : EDGE_COLOR_DIMMED };
      }

      if (selection.type === 'edge') {
        const isSelected = source === selection.edgeSourceEmail && target === selection.edgeTargetEmail;
        return { ...attr, color: isSelected ? EDGE_COLOR_SELECTED : EDGE_COLOR_DIMMED };
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

  private _applyHoverState(hoveredNode: string): void {
    if (!this._sigma || !this._graph) {
      return;
    }

    const selection = this.$selection();
    if (selection.type !== 'none') {
      return;
    }

    this._graph.updateEachNodeAttributes((node, attr) => {
      if (node === hoveredNode) {
        return { ...attr, color: NODE_COLOR_HOVER, borderColor: NODE_COLOR_HOVER };
      }
      return attr;
    });

    this._graph.updateEachEdgeAttributes((_edge, attr, source, target) => {
      const isConnected = source === hoveredNode || target === hoveredNode;
      if (isConnected) {
        return { ...attr, color: EDGE_COLOR_HOVER };
      }
      return attr;
    });

    this._sigma.refresh();
  }

  private _applyEdgeHoverState(edge: string): void {
    if (!this._sigma || !this._graph) {
      return;
    }

    const selection = this.$selection();
    if (selection.type !== 'none') {
      return;
    }

    const edgeSource = this._graph.source(edge);
    const edgeTarget = this._graph.target(edge);

    this._graph.updateEachNodeAttributes((node, attr) => {
      if (node === edgeSource || node === edgeTarget) {
        return { ...attr, color: NODE_COLOR_HOVER, borderColor: NODE_COLOR_HOVER };
      }
      return attr;
    });

    this._graph.updateEachEdgeAttributes((e, attr) => {
      if (e === edge) {
        return { ...attr, color: EDGE_COLOR_HOVER };
      }
      return attr;
    });

    this._sigma.refresh();
  }

  private _clearHoverState(): void {
    if (!this._sigma || !this._graph) {
      return;
    }

    const selection = this.$selection();
    const visibleNodes = this.$visibleNodes();
    this._applyVisualState(selection, visibleNodes);
  }

  public onZoomIn(): void {
    if (!this._sigma) {
      return;
    }
    const camera = this._sigma.getCamera();
    camera.animatedZoom({ duration: 300 });
  }

  public onZoomOut(): void {
    if (!this._sigma) {
      return;
    }
    const camera = this._sigma.getCamera();
    camera.animatedUnzoom({ duration: 300 });
  }

  public onRecenter(): void {
    if (!this._sigma) {
      return;
    }
    const camera = this._sigma.getCamera();
    camera.animatedReset({ duration: 300 });
  }
}
