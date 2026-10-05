import { ascentPosition, ascentFacing } from '../artwork/journey';

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
  return symbol;
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
  const traveler = use(
    desktop,
    'traveler',
    x - 8,
    y - 24,
    16,
    24,
    'journey-traveler',
  );
  if (ascentFacing(fraction) === -1)
    traveler.setAttribute('transform', `translate(${2 * x} 0) scale(-1 1)`);
  const mobile = svg('0 0 288 56', 'journey-mobile');
  use(mobile, 'mobile-path', 0, 0, 288, 56);
  const mx = Math.round((20 + fraction * 238) / 2) * 2;
  const my = mx < 74 ? 44 : mx < 140 ? 40 : mx < 204 ? 36 : mx < 264 ? 40 : 36;
  use(mobile, 'traveler', mx - 8, my - 24, 16, 24, 'journey-traveler');
  wrap.append(desktop, mobile);
  return wrap;
}

export function arrivalJourney() {
  // The same crest, cropped to a quiet fragment rather than another landscape.
  const node = svg('84 0 64 60', 'journey-arrival journey-final');
  use(node, 'crest', 0, 0, 192, 256);
  use(node, 'flag', 116, 6, 12, 18);
  use(node, 'traveler', 100, 4, 16, 24).setAttribute(
    'transform',
    'translate(216 0) scale(-1 1)',
  );
  const sky = document.createElement('div');
  sky.className = 'journey-arrival-scene journey-final';
  sky.setAttribute('aria-hidden', 'true');
  const sun = svg('0 0 24 12', 'arrival-sun');
  use(sun, 'sun', 0, 0, 24, 12);
  for (const className of [
    'arrival-cloud',
    'arrival-cloud arrival-cloud-far',
    'arrival-cloud arrival-cloud-third',
  ]) {
    const cloud = svg('0 0 64 24', className);
    use(cloud, 'cloud', 0, 0, 64, 24);
    sky.append(cloud);
  }
  sky.append(sun, node);
  return sky;
}
