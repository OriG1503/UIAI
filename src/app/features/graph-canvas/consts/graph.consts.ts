export const NODE_SIZE_MIN: number = 10;
export const NODE_SIZE_MAX: number = 35;
export const NODE_SIZE_DEFAULT: number = 6;

export const EDGE_SIZE_MIN: number = 1;
export const EDGE_SIZE_MAX: number = 6;

export const NODE_COLOR_DEFAULT: string = '#8fabeb';
export const NODE_COLOR_SELECTED: string = '#ca899b';
export const NODE_COLOR_NEIGHBOR: string = '#ca899b';
export const NODE_COLOR_DIMMED: string = '#9a9a9aB3';
export const NODE_COLOR_HOVER: string = '#ca899b';
export const NODE_GAP_COLOR: string = '#d9d9d9';

export const NODE_BORDER_RATIO: number = 0.05;
export const NODE_GAP_RATIO: number = 0.06;

export const EDGE_COLOR_DEFAULT: string = '#8fabeb';
export const EDGE_COLOR_SELECTED: string = '#ca899b';
export const EDGE_COLOR_HOVER: string = '#ca899b';
export const EDGE_COLOR_DIMMED: string = '#9a9a9aB3';

export const LABEL_COLOR: string = '#000000';
export const LABEL_COLOR_DEFAULT: string = '#03153a';
export const LABEL_COLOR_DIMMED: string = 'rgba(0, 0, 0, 0.7)';
export const LABEL_FONT_FAMILY: string = 'Assistant';
export const LABEL_FONT_SIZE: number = 12;
export const LABEL_STROKE_WIDTH: number = 3;
export const LABEL_STROKE_COLOR: string = '#d9d9d9';
export const LABEL_RENDERED_SIZE_THRESHOLD: number = 0;
export const LABEL_CLICK_RADIUS: number = 30;
export const EDGE_LABEL_ZOOM_THRESHOLD: number = 1.5;

export const ICON_COLOR_DEFAULT: string = '#ffffff';
export const ICON_COLOR_SELECTED: string = '#ffffff';

export const DRAWER_HEIGHT_MIN: number = 20;
export const DRAWER_HEIGHT_MAX: number = 90;
export const DRAWER_HEIGHT_DEFAULT: number = 40;

export const FORCEATLAS2_ITERATIONS: number = 400;
export const FORCEATLAS2_SETTINGS: {
  gravity: number;
  scalingRatio: number;
  slowDown: number;
  barnesHutOptimize: boolean;
  barnesHutTheta: number;
  adjustSizes: boolean;
  linLongMode: boolean;
  strongGravityMode: boolean;
  outboundAttractionDistribution: boolean;
} = {
  gravity: 0.001,
  scalingRatio: 800,
  slowDown: 5,
  barnesHutOptimize: true,
  barnesHutTheta: 0.5,
  adjustSizes: true,
  linLongMode: false,
  strongGravityMode: false,
  outboundAttractionDistribution: true,
};
