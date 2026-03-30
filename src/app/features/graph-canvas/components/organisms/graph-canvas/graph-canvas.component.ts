import {
  Component,
  input,
  output,
  OutputEmitterRef,
  inject,
  OnDestroy,
  effect,
  untracked,
  ElementRef,
  NgZone,
  ViewChild,
  AfterViewInit,
  InputSignal,
} from '@angular/core';
import Graph from 'graphology';
import Sigma from 'sigma';
import { EdgeArrowProgram } from 'sigma/rendering';
import { EdgeCurvedArrowProgram, indexParallelEdgesIndex } from '@sigma/edge-curve';
import { GraphData } from '../../../types/graph-data.type';
import { GraphSelection } from '../../../types/graph-selection.type';
import { GRAPH_LABEL_MAP } from '../../../mapping/graph.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { ICON_SIZE_LG } from '../../../../../shared/consts/icon-size.consts';
import { ThemeService } from '../../../../../core/services/theme.service';
import {
  NODE_SIZE_MIN,
  NODE_SIZE_MAX,
  EDGE_SIZE_MIN,
  EDGE_SIZE_MAX,
  NODE_COLOR_DEFAULT,
  NODE_COLOR_DEFAULT_DARK,
  NODE_COLOR_SELECTED,
  NODE_COLOR_DIMMED,
  NODE_COLOR_DIMMED_DARK,
  NODE_COLOR_HOVER,
  EDGE_COLOR_DEFAULT,
  EDGE_COLOR_DEFAULT_DARK,
  EDGE_COLOR_SELECTED,
  EDGE_COLOR_DIMMED,
  EDGE_COLOR_DIMMED_DARK,
  EDGE_COLOR_HOVER,
  LABEL_COLOR,
  LABEL_RENDERED_SIZE_THRESHOLD,
  LABEL_CLICK_RADIUS,
  EDGE_LABEL_ZOOM_THRESHOLD,
} from '../../../consts/graph.consts';
import { BorderedNodeProgram, drawCustomLabel, setSigmaInstanceForRefresh } from './graph-canvas-rendering';
import { GraphNode } from '../../../types/graph-node.type';
import { GraphEdge } from '../../../types/graph-edge.type';

@Component({
  selector: 'app-graph-canvas',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './graph-canvas.component.html',
  styleUrl: './graph-canvas.component.scss',
})
export class GraphCanvasComponent implements AfterViewInit, OnDestroy {
  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  public readonly ICON_SIZE_LG = ICON_SIZE_LG;

  @ViewChild('sigmaContainer', { static: true }) private _containerRef!: ElementRef<HTMLDivElement>;

  public $graphData: InputSignal<GraphData | null> = input<GraphData | null>(null, { alias: 'graphData' });
  public $positions: InputSignal<Record<string, { x: number; y: number }>> = input<Record<string, { x: number; y: number }>>(
    {},
    { alias: 'positions' },
  );
  public $mergeData: InputSignal<{ data: GraphData; positions: Record<string, { x: number; y: number }> } | null> = input<{
    data: GraphData;
    positions: Record<string, { x: number; y: number }>;
  } | null>(null, { alias: 'mergeData' });
  public $selection: InputSignal<GraphSelection> = input<GraphSelection>({ type: 'none' }, { alias: 'selection' });
  public $visibleNodes: InputSignal<Set<string>> = input<Set<string>>(new Set(), { alias: 'visibleNodes' });
  public $hoveredNode: InputSignal<string | null> = input<string | null>(null, { alias: 'hoveredNode' });

  public nodeClick: OutputEmitterRef<string> = output<string>();
  public edgeClick: OutputEmitterRef<{ source: string; target: string }> = output<{ source: string; target: string }>();
  public stageClick: OutputEmitterRef<void> = output<void>();

  private _ngZone: NgZone = inject(NgZone);
  private _themeService: ThemeService = inject(ThemeService);
  private _graph: Graph | null = null;
  private _sigma: Sigma | null = null;
  private _isInitialized: boolean = false;
  private _isDragging: boolean = false;
  private _draggedNode: string | null = null;
  private _hoveredNode: string | null = null;
  private _hoveredEdge: string | null = null;

  public readonly translations: typeof GRAPH_LABEL_MAP = GRAPH_LABEL_MAP;

  constructor() {
    effect(() => {
      const data: GraphData | null = this.$graphData();
      const positions: Record<string, { x: number; y: number }> = this.$positions();
      if (!this._isInitialized || !data) {
        return;
      }
      this._buildGraph(data, positions);
    });

    effect(() => {
      const merge: { data: GraphData; positions: Record<string, { x: number; y: number }> } | null = this.$mergeData();
      if (!this._isInitialized || !merge) {
        return;
      }
      this._mergeGraphData(merge.data, merge.positions);
    });

    effect(() => {
      const selection: GraphSelection = this.$selection();
      const visibleNodes: Set<string> = this.$visibleNodes();
      if (!this._isInitialized || !this._sigma || !this._graph) {
        return;
      }
      this._applyVisualState(selection, visibleNodes);
    });

    effect(() => {
      const hoveredNode: string | null = this.$hoveredNode();
      if (!this._isInitialized || !this._sigma || !this._graph) {
        return;
      }
      if (hoveredNode) {
        this._applyHoverState(hoveredNode);
      } else {
        this._clearHoverState();
      }
    });

    effect(() => {
      this._themeService.$isDarkMode();
      if (!this._isInitialized || !this._sigma || !this._graph) {
        return;
      }
      this._updateGraphColors();
    });
  }

  ngAfterViewInit(): void {
    this._isInitialized = true;
    const data: GraphData | null = this.$graphData();
    const positions: Record<string, { x: number; y: number }> = this.$positions();
    if (data) {
      this._buildGraph(data, positions);
    }
  }

  ngOnDestroy(): void {
    this._sigma?.kill();
    this._sigma = null;
    this._graph = null;
    setSigmaInstanceForRefresh(null);
  }

  private _buildGraph(data: GraphData, positions: Record<string, { x: number; y: number }>): void {
    this._sigma?.kill();
    this._graph = new Graph();

    const nodeDefault: string = this._getNodeDefaultColor();
    const edgeDefault: string = this._getEdgeDefaultColor();
    const maxMailCount: number = Math.max(...Array.from(data.nodes.values()).map((node: GraphNode) => node.mailCount), 1);

    data.nodes.forEach((node: GraphNode) => {
      const sizeRatio: number = node.mailCount / maxMailCount;
      const size: number = NODE_SIZE_MIN + sizeRatio * (NODE_SIZE_MAX - NODE_SIZE_MIN);
      const pos: { x: number; y: number } | undefined = positions[node.email];
      this._graph!.addNode(node.email, {
        label: node.email,
        size,
        color: nodeDefault,
        borderColor: nodeDefault,
        type: 'bordered',
        x: pos?.x ?? Math.random() * 100,
        y: pos?.y ?? Math.random() * 100,
        mailCount: node.mailCount,
      });
    });

    const maxEdgeCount: number = data.maxEdgeCount || 1;
    const edgeKeys: Set<string> = new Set<string>();
    data.edges.forEach((edge: GraphEdge) => {
      edgeKeys.add(`${edge.sourceEmail}|${edge.targetEmail}`);
    });

    data.edges.forEach((edge: GraphEdge) => {
      const sizeRatio: number = edge.mailCount / maxEdgeCount;
      const size: number = EDGE_SIZE_MIN + sizeRatio * (EDGE_SIZE_MAX - EDGE_SIZE_MIN);
      if (this._graph!.hasNode(edge.sourceEmail) && this._graph!.hasNode(edge.targetEmail)) {
        const reverseKey: string = `${edge.targetEmail}|${edge.sourceEmail}`;
        const isBidirectional: boolean = edgeKeys.has(reverseKey);
        this._graph!.addDirectedEdge(edge.sourceEmail, edge.targetEmail, {
          size,
          color: edgeDefault,
          mailCount: edge.mailCount,
          label: String(edge.mailCount),
          type: isBidirectional ? 'curvedArrow' : 'arrow',
        });
      }
    });

    indexParallelEdgesIndex(this._graph!, {
      edgeIndexAttribute: 'parallelIndex',
      edgeMinIndexAttribute: 'parallelMinIndex',
      edgeMaxIndexAttribute: 'parallelMaxIndex',
    });

    this._ngZone.runOutsideAngular(() => {
      this._sigma = new Sigma(this._graph!, this._containerRef.nativeElement, {
        renderEdgeLabels: false,
        enableEdgeEvents: true,
        defaultNodeColor: nodeDefault,
        defaultEdgeColor: edgeDefault,
        defaultNodeType: 'bordered',
        defaultEdgeType: 'arrow',
        nodeProgramClasses: {
          bordered: BorderedNodeProgram,
        },
        edgeProgramClasses: {
          arrow: EdgeArrowProgram,
          curvedArrow: EdgeCurvedArrowProgram,
        },
        labelRenderedSizeThreshold: LABEL_RENDERED_SIZE_THRESHOLD,
        labelDensity: Infinity,
        labelGridCellSize: 1,
        edgeLabelSize: 10,
        edgeLabelColor: { color: LABEL_COLOR },
        defaultDrawNodeLabel: drawCustomLabel,
        defaultDrawNodeHover: drawCustomLabel,
      });

      setSigmaInstanceForRefresh(this._sigma);

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
          const source: string = this._graph!.source(edge);
          const target: string = this._graph!.target(edge);
          this.edgeClick.emit({ source, target });
        });
      });

      this._sigma.on('clickStage', ({ event }) => {
        const nearNode: string | null = this._findNodeNearViewport(event.x, event.y);
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
        const ratio: number = this._sigma.getCamera().ratio;
        const shouldRenderEdgeLabels: boolean = ratio < 1 / EDGE_LABEL_ZOOM_THRESHOLD;
        this._sigma.setSetting('renderEdgeLabels', shouldRenderEdgeLabels);
      });

      const selection: GraphSelection = untracked(() => this.$selection());
      const visibleNodes: Set<string> = untracked(() => this.$visibleNodes());
      this._applyVisualState(selection, visibleNodes);
    });
  }

  private _mergeGraphData(data: GraphData, positions: Record<string, { x: number; y: number }>): void {
    if (!this._graph || !this._sigma) {
      return;
    }

    const nodeDefault: string = this._getNodeDefaultColor();
    const edgeDefault: string = this._getEdgeDefaultColor();
    const maxMailCount: number = Math.max(...Array.from(data.nodes.values()).map((node: GraphNode) => node.mailCount), 1);
    const maxEdgeCount: number = data.maxEdgeCount || 1;

    data.nodes.forEach((node: GraphNode) => {
      if (this._graph!.hasNode(node.email)) {
        return;
      }
      const sizeRatio: number = node.mailCount / maxMailCount;
      const size: number = NODE_SIZE_MIN + sizeRatio * (NODE_SIZE_MAX - NODE_SIZE_MIN);
      const pos: { x: number; y: number } | undefined = positions[node.email];
      this._graph!.addNode(node.email, {
        label: node.email,
        size,
        color: nodeDefault,
        borderColor: nodeDefault,
        type: 'bordered',
        x: pos?.x ?? Math.random() * 100,
        y: pos?.y ?? Math.random() * 100,
        mailCount: node.mailCount,
      });
    });

    data.edges.forEach((edge: GraphEdge) => {
      if (!this._graph!.hasNode(edge.sourceEmail) || !this._graph!.hasNode(edge.targetEmail)) {
        return;
      }
      if (this._graph!.hasDirectedEdge(edge.sourceEmail, edge.targetEmail)) {
        return;
      }
      const sizeRatio: number = edge.mailCount / maxEdgeCount;
      const size: number = EDGE_SIZE_MIN + sizeRatio * (EDGE_SIZE_MAX - EDGE_SIZE_MIN);
      const isBidirectional: boolean = this._graph!.hasDirectedEdge(edge.targetEmail, edge.sourceEmail);
      this._graph!.addDirectedEdge(edge.sourceEmail, edge.targetEmail, {
        size,
        color: edgeDefault,
        mailCount: edge.mailCount,
        label: String(edge.mailCount),
        type: isBidirectional ? 'curvedArrow' : 'arrow',
      });
    });

    this._graph.updateEachEdgeAttributes((_edge, attr, source, target) => {
      const isBidirectional: boolean = this._graph!.hasDirectedEdge(target, source);
      return { ...attr, type: isBidirectional ? 'curvedArrow' : 'arrow' };
    });

    indexParallelEdgesIndex(this._graph, {
      edgeIndexAttribute: 'parallelIndex',
      edgeMinIndexAttribute: 'parallelMinIndex',
      edgeMaxIndexAttribute: 'parallelMaxIndex',
    });

    const selection: GraphSelection = untracked(() => this.$selection());
    const visibleNodes: Set<string> = untracked(() => this.$visibleNodes());
    this._applyVisualState(selection, visibleNodes);
  }

  private _applyVisualState(selection: GraphSelection, visibleNodes: Set<string>): void {
    if (!this._sigma || !this._graph) {
      return;
    }

    const selectedNeighbors: Set<string> = new Set<string>();
    if (selection.type === 'node' && selection.nodeEmail) {
      if (this._graph.hasNode(selection.nodeEmail)) {
        this._graph.neighbors(selection.nodeEmail).forEach((neighbor: string) => selectedNeighbors.add(neighbor));
      }
    }

    const nodeDefault: string = this._getNodeDefaultColor();
    const nodeDimmed: string = this._getNodeDimmedColor();
    const edgeDefault: string = this._getEdgeDefaultColor();
    const edgeDimmed: string = this._getEdgeDimmedColor();

    this._graph.updateEachNodeAttributes((node, attr) => {
      if (selection.type === 'none') {
        return { ...attr, color: nodeDefault, borderColor: nodeDefault };
      }

      if (selection.type === 'node') {
        if (node === selection.nodeEmail) {
          return { ...attr, color: NODE_COLOR_SELECTED, borderColor: NODE_COLOR_SELECTED };
        }
        if (selectedNeighbors.has(node)) {
          return { ...attr, color: nodeDefault, borderColor: NODE_COLOR_SELECTED };
        }
        return { ...attr, color: nodeDimmed, borderColor: nodeDimmed };
      }

      if (selection.type === 'edge') {
        const isEndpoint: boolean = node === selection.edgeSourceEmail || node === selection.edgeTargetEmail;
        if (isEndpoint) {
          return { ...attr, color: nodeDefault, borderColor: NODE_COLOR_SELECTED };
        }
        return { ...attr, color: nodeDimmed, borderColor: nodeDimmed };
      }

      return attr;
    });

    this._graph.updateEachEdgeAttributes((_edge, attr, source, target) => {
      if (selection.type === 'none') {
        return { ...attr, color: edgeDefault };
      }

      if (selection.type === 'node') {
        const isConnected: boolean = source === selection.nodeEmail || target === selection.nodeEmail;
        return { ...attr, color: isConnected ? EDGE_COLOR_SELECTED : edgeDimmed };
      }

      if (selection.type === 'edge') {
        const isSelected: boolean = source === selection.edgeSourceEmail && target === selection.edgeTargetEmail;
        return { ...attr, color: isSelected ? EDGE_COLOR_SELECTED : edgeDimmed };
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
      const source: string = this._graph!.source(edge);
      const target: string = this._graph!.target(edge);
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

    const visibleNodes: Set<string> = this.$visibleNodes();
    let closestNode: string | null = null;
    let closestDist: number = Infinity;

    this._graph.forEachNode((node, attrs) => {
      if (!visibleNodes.has(node)) {
        return;
      }
      const nodeViewport = this._sigma!.graphToViewport({ x: attrs['x'], y: attrs['y'] });
      const dist: number = Math.sqrt(Math.pow(viewportX - nodeViewport.x, 2) + Math.pow(viewportY - nodeViewport.y, 2));
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

    const selection: GraphSelection = this.$selection();
    if (selection.type !== 'none') {
      return;
    }

    const nodeDefault: string = this._getNodeDefaultColor();
    const edgeDefault: string = this._getEdgeDefaultColor();

    this._graph.updateEachNodeAttributes((node, attr) => {
      if (node === hoveredNode) {
        return { ...attr, color: NODE_COLOR_HOVER, borderColor: NODE_COLOR_HOVER };
      }
      return { ...attr, color: nodeDefault, borderColor: nodeDefault };
    });

    this._graph.updateEachEdgeAttributes((_edge, attr, source, target) => {
      const isConnected: boolean = source === hoveredNode || target === hoveredNode;
      return { ...attr, color: isConnected ? EDGE_COLOR_HOVER : edgeDefault };
    });

    this._sigma.refresh();
  }

  private _applyEdgeHoverState(edge: string): void {
    if (!this._sigma || !this._graph) {
      return;
    }

    const selection: GraphSelection = this.$selection();
    if (selection.type !== 'none') {
      return;
    }

    const edgeSource: string = this._graph.source(edge);
    const edgeTarget: string = this._graph.target(edge);

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

    const selection: GraphSelection = this.$selection();
    const visibleNodes: Set<string> = this.$visibleNodes();
    this._applyVisualState(selection, visibleNodes);
  }

  private _updateGraphColors(): void {
    const selection: GraphSelection = untracked(() => this.$selection());
    const visibleNodes: Set<string> = untracked(() => this.$visibleNodes());
    this._applyVisualState(selection, visibleNodes);
    this._sigma?.refresh();
  }

  private _getNodeDefaultColor(): string {
    return this._themeService.$isDarkMode() ? NODE_COLOR_DEFAULT_DARK : NODE_COLOR_DEFAULT;
  }

  private _getNodeDimmedColor(): string {
    return this._themeService.$isDarkMode() ? NODE_COLOR_DIMMED_DARK : NODE_COLOR_DIMMED;
  }

  private _getEdgeDefaultColor(): string {
    return this._themeService.$isDarkMode() ? EDGE_COLOR_DEFAULT_DARK : EDGE_COLOR_DEFAULT;
  }

  private _getEdgeDimmedColor(): string {
    return this._themeService.$isDarkMode() ? EDGE_COLOR_DIMMED_DARK : EDGE_COLOR_DIMMED;
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
