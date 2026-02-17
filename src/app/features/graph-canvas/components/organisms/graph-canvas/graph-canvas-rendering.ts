import Sigma from 'sigma';
import { Settings } from 'sigma/settings';
import { NodeDisplayData, PartialButFor } from 'sigma/types';
import { createNodeBorderProgram } from '@sigma/node-border';
import {
  NODE_GAP_COLOR,
  NODE_BORDER_RATIO,
  NODE_GAP_RATIO,
  NODE_COLOR_DIMMED,
  ICON_COLOR_DEFAULT,
  LABEL_COLOR,
  LABEL_COLOR_DIMMED,
  LABEL_FONT_FAMILY,
  LABEL_FONT_SIZE,
  LABEL_STROKE_WIDTH,
  LABEL_STROKE_COLOR,
} from '../../../consts/graph.consts';

export const BorderedNodeProgram = createNodeBorderProgram({
  borders: [
    {
      size: { value: NODE_GAP_RATIO },
      color: { value: NODE_GAP_COLOR },
    },
    {
      size: { value: NODE_BORDER_RATIO },
      color: { attribute: 'borderColor' },
    },
    {
      size: { value: NODE_GAP_RATIO },
      color: { value: NODE_GAP_COLOR },
    },
    {
      size: { fill: true },
      color: { attribute: 'color' },
    },
  ],
});

const ENVELOPE_ICON_SVG: string = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${ICON_COLOR_DEFAULT}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`)}`;

const ENVELOPE_ICON_DIMMED_SVG: string = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`)}`;

const envelopeImage: HTMLImageElement = new Image();
envelopeImage.src = ENVELOPE_ICON_SVG;

const envelopeImageDimmed: HTMLImageElement = new Image();
envelopeImageDimmed.src = ENVELOPE_ICON_DIMMED_SVG;

let _sigmaInstanceForRefresh: Sigma | null = null;
envelopeImage.onload = (): void => {
  _sigmaInstanceForRefresh?.refresh();
};

export const setSigmaInstanceForRefresh = (sigma: Sigma | null): void => {
  _sigmaInstanceForRefresh = sigma;
};

const drawEnvelopeIcon = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  isDimmed: boolean = false,
): void => {
  const iconSize: number = size * 0.9;
  const img: HTMLImageElement = isDimmed ? envelopeImageDimmed : envelopeImage;
  if (img.complete) {
    context.drawImage(img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
  }
};

export const drawCustomLabel = (
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, 'x' | 'y' | 'size' | 'label' | 'color'>,
  _settings: Settings,
): void => {
  if (!data.label) {
    return;
  }

  const size: number = data.size;
  const x: number = data.x;
  const y: number = data.y;
  const isDimmed: boolean = data.color === NODE_COLOR_DIMMED;

  drawEnvelopeIcon(context, x, y, size, isDimmed);

  const fontSize: number = LABEL_FONT_SIZE;
  const labelY: number = y + size + fontSize * 0.4;
  const labelColor: string = isDimmed ? LABEL_COLOR_DIMMED : LABEL_COLOR;

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
