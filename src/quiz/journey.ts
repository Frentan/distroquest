import { ascentPosition } from '../artwork/journey';

function svg(viewBox: string, className: string) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  node.setAttribute('viewBox', viewBox);
  node.setAttribute('class', className);
  node.setAttribute('aria-hidden', 'true');
  node.setAttribute('shape-rendering', 'crispEdges');
  return node;
}
function use(
  node: SVGSVGElement,
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  className?: string,
) {
  const symbol = document.createElementNS(node.namespaceURI, 'use');
  for (const [key, value] of Object.entries({
    href: `#journey-${id}`,
    x,
    y,
    width,
    height,
  }))
    symbol.setAttribute(key, String(value));
  if (className) symbol.setAttribute('class', className);
  node.append(symbol);
}
function path(node: SVGSVGElement, d: string) {
  const shape = document.createElementNS(node.namespaceURI, 'path');
  shape.setAttribute('d', d);
  shape.setAttribute('fill', 'var(--scene-path)');
  node.append(shape);
}

/** Capture submitted stage at question render. Selection updates never move it.
 * Back uses the submitted prefix preceding the active question, not future answers.
 */
export function questionJourney(
  current: number,
  total: number,
  submitted: number,
  final: boolean,
) {
  const fraction = Math.min(current - 1, submitted) / total;
  const wrap = document.createElement('div');
  wrap.className = `question-journey${final ? ' journey-final' : ''}`;
  wrap.setAttribute('aria-hidden', 'true');
  wrap.dataset.stage = String(Math.min(current - 1, submitted));
  wrap.dataset.total = String(total);
  const desktop = svg('0 0 192 256', 'journey-desktop');
  use(desktop, 'landscape', 0, 0, 192, 256);
  use(desktop, 'flag', 116, 6, 12, 18);
  const [x, y] = ascentPosition(fraction);
  use(desktop, 'traveler', x - 6, y - 18, 12, 18, 'journey-traveler');
  const mobile = svg('0 0 288 56', 'journey-mobile');
  path(mobile, 'M8 44h66v-4h66v-4h64v4h60v-4h16v4h-12v4h-68v-4h-56v4H78v4H8z');
  use(mobile, 'pine', 2, 10, 12, 24);
  use(mobile, 'pine', 38, 4, 8, 16);
  use(mobile, 'pine', 114, 0, 8, 16);
  use(mobile, 'pine', 208, 2, 8, 16);
  use(mobile, 'pine', 272, 8, 12, 24);
  path(mobile, 'M32 50h8v2h-8zM96 48h6v2h-6zM192 46h8v2h-8z');
  mobile.lastElementChild?.setAttribute('fill', 'var(--grass)');
  use(mobile, 'flag', 262, 14, 12, 18);
  const mx = Math.round((20 + fraction * 238) / 2) * 2;
  const my = mx < 74 ? 44 : mx < 140 ? 40 : mx < 204 ? 36 : mx < 264 ? 40 : 36;
  use(mobile, 'traveler', mx - 6, my - 18, 12, 18, 'journey-traveler');
  wrap.append(desktop, mobile);
  return wrap;
}

export function arrivalJourney() {
  const node = svg('0 0 96 32', 'journey-arrival');
  use(node, 'camp', 2, 0, 64, 32);
  use(node, 'flag', 74, 0, 16, 24);
  return node;
}
