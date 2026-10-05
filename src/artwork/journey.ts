/** Editable pixel geometry. Coordinates use a two-unit grid (one-unit eye pixels); no raster or filters.
 * One composition, pine, terminal, flag and traveler serve every journey state.
 * The CSS theme palette applies to terrain; the traveler's palette stays fixed.
 */
export const ascent = [
  [96, 244],
  [96, 232],
  [122, 220],
  [128, 208],
  [108, 196],
  [84, 184],
  [82, 172],
  [102, 160],
  [126, 148],
  [128, 136],
  [110, 124],
  [94, 112],
  [96, 100],
  [116, 88],
  [130, 76],
  [122, 64],
  [108, 52],
  [110, 40],
  [108, 28],
] as const;

// Quantize a winding centerline into deliberate square steps, not smooth curves.
function pixelLine(points: readonly (readonly [number, number])[]) {
  const cells = new Set<string>();
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / 2;
    for (let j = 0; j <= steps; j++) {
      cells.add(
        `${Math.round((x0 + ((x1 - x0) * j) / steps) / 2) * 2},${Math.round((y0 + ((y1 - y0) * j) / steps) / 2) * 2}`,
      );
    }
  }
  return [...cells]
    .map((cell) => {
      const [x, y] = cell.split(',').map(Number);
      return `M${x - 2} ${y - 2}h4v4h-4z`;
    })
    .join('');
}

export function ascentPosition(fraction: number): [number, number] {
  const stage = Math.max(0, Math.min(1, fraction)) * (ascent.length - 1);
  const index = Math.min(ascent.length - 2, Math.floor(stage));
  const mix = stage - index;
  return ascent[index].map(
    (n, axis) => Math.round((n + (ascent[index + 1][axis] - n) * mix) / 2) * 2,
  ) as [number, number];
}

/** Face along the active ascent segment; vertical segments inherit the next turn. */
export function ascentFacing(fraction: number): 1 | -1 {
  const index = Math.min(
    ascent.length - 2,
    Math.floor(Math.max(0, Math.min(1, fraction)) * (ascent.length - 1)),
  );
  for (let i = index; i < ascent.length - 1; i++) {
    const dx = ascent[i + 1][0] - ascent[i][0];
    if (dx) return dx > 0 ? 1 : -1;
  }
  return 1;
}

// Separated canopies; the terminal's rock and immediate background stay clear.
const pines = [
  [14, 136, 0.5],
  [36, 116, 1],
  [50, 158, 0.5],
  [132, 150, 1],
  [174, 164, 0.5],
  [144, 104, 0.5],
  [86, 84, 0.5],
  [134, 60, 0.5],
  [6, 206, 0.5],
  [12, 242, 0.5],
  [166, 218, 0.5],
  [166, 252, 0.5],
  [142, 242, 0.5],
  [146, 174, 0.5],
];
// Authored clusters leave the switchbacks, exposed faces and summit clear.
const lichen = `<path d="M66 98h6v2h-6zM70 102h4v2h-4zM56 150h6v2h-6zM60 154h4v2h-4zM132 156h6v2h-6zM136 160h4v2h-4zM64 204h8v2h-8zM70 208h4v2h-4zM144 226h6v2h-6zM148 230h4v2h-4zM26 224h6v2h-6z" fill="var(--grass)"/>`;

export const journeySymbols = `
<!-- Open ends: the alpha steps soften the dirt and trim the two dark end caps. -->
<mask id="journey-trail-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="192" height="256">
 <path d="M0 34h192v204H0z" fill="white"/>
 <path d="M0 32h192v2H0zM0 238h192v2H0z" fill="white" opacity="0.8"/>
 <path d="M0 30h192v2H0zM0 240h192v2H0z" fill="white" opacity="0.6"/>
 <path d="M0 28h192v2H0zM0 242h192v2H0z" fill="white" opacity="0.4"/>
 <path d="M0 26h192v2H0zM0 244h192v2H0z" fill="white" opacity="0.2"/>
</mask>
<symbol id="journey-pine" viewBox="0 0 24 48">
 <path d="M10 36h4v12h-4z" fill="var(--tree-trunk)"/>
 <path d="M10 0h4v6h2v6h4v4h-4v4h4v6h4v4h-4v4h4v6H0v-6h4v-4H0v-4h4v-6h4v-4H4v-4h4V6h2z" fill="var(--tree)"/>
 <path d="M10 6h2v8H8v-2h2zM8 20h4v4H6v-2h2zM6 30h6v6H4v-4h2z" fill="var(--tree-light)"/>
</symbol>
<symbol id="journey-traveler-body" viewBox="0 0 16 24">
 <path d="M4 0h6v2h2v6H4V6H2V2h2z" fill="#59412d"/>
 <path d="M4 2h6v2H4z" fill="#795438"/>
 <path d="M6 4h6v4h-2v2H6z" fill="#e5b47a"/>
 <path d="M8 6h2v2H8z" fill="#f1c792"/>
 <path d="M9 5h1v2H9z" fill="#292c2b"/>
 <path d="M4 10h6v2h2v6H4z" fill="#b84e43"/>
 <path d="M6 10h2v6H6z" fill="#d36b55"/>
 <path d="M2 10h2v2h2v6H0v-6h2z" fill="#273e2d"/>
 <path d="M2 12h2v4H2z" fill="#9b8958"/>
 <path d="M6 16h4v2H6z" fill="#873c35"/>
 <path d="M4 18h8v2h-2v2H8v-2H6v2H2v-2h2z" fill="#263e50"/>
 <path d="M8 18h2v2H8z" fill="#426078"/>
 <path d="M2 22h4v2H0v-2zM8 22h6v2H8z" fill="#292c2b"/>
</symbol>
<symbol id="journey-traveler" viewBox="0 0 16 24">
 <use href="#journey-traveler-body" width="16" height="24"/>
 <path d="M10 12h2v2h2v2h-4z" fill="#d36b55"/>
 <path d="M12 16h4v2h-4z" fill="#e5b47a"/>
</symbol>
<symbol id="journey-flag" viewBox="0 0 16 24">
 <path d="M2 0h2v24H2z" fill="#8a663c"/>
 <path d="M4 2h12v2h-2v2h-2v2h-2v2H4z" fill="#edc16a"/>
 <path d="M4 2h8v2H4z" fill="#ffe0a0"/>
</symbol>
<symbol id="journey-mobile-path" viewBox="0 0 288 56">
 <path d="M8 44h66v-4h66v-4h64v4h60v-4h16v4h-12v4h-68v-4h-56v4H78v4H8z" fill="var(--scene-path)"/>
 <use href="#journey-pine" x="2" y="10" width="12" height="24"/>
 <use href="#journey-pine" x="38" y="4" width="12" height="24"/>
 <use href="#journey-pine" x="114" y="0" width="12" height="24"/>
 <use href="#journey-pine" x="208" y="2" width="12" height="24"/>
 <use href="#journey-pine" x="272" y="8" width="12" height="24"/>
 <path d="M32 50h8v2h-8zM96 48h6v2h-6zM192 46h8v2h-8z" fill="var(--grass)"/>
 <use href="#journey-flag" x="262" y="14" width="12" height="18"/>
</symbol>
<symbol id="journey-cloud" viewBox="0 0 64 24">
 <path d="M6 20h10v-4h8v-6h12V6h12v6h8v4h8v4z" fill="var(--scene-cloud)"/>
</symbol>
<symbol id="journey-sun" viewBox="0 0 24 12">
 <path d="M8 0h8v2h4v2h2v4h2v4H0V8h2V4h2V2h4z" fill="var(--scene-sun)"/>
 <path d="M0 5h24v1H0zM0 7h24v1H0zM0 9h24v1H0z" fill="var(--scene-sky)"/>
</symbol>
<symbol id="journey-crest" viewBox="0 0 192 256">
 <path d="M84 60h8V46h10V24h20v14h10v18h10v4z" fill="var(--mountain-front)"/>
 <path d="M102 24h20v4h-20zM122 38h10v4h-10z" fill="var(--mountain-snow)"/>
 <path d="M104 28h8v4h-4v8h-4z" fill="var(--journey-trail, #edc77f)" opacity="var(--crest-trail-opacity, 1)" mask="url(#journey-trail-fade)"/>
</symbol>
<symbol id="journey-terminal" viewBox="0 0 32 32">
 <path d="M4 0h24v2h2v20h-2v2H4v-2H2V2h2zM12 24h8v2h6v2H6v-2h6z" fill="var(--computer-frame)"/>
 <path d="M0 2h4v22H0z" fill="#657365"/>
 <path d="M6 4h20v16H6z" fill="var(--computer-screen)"/>
 <path d="M10 8h2v2h2v2h-2v2h-2v-2h2v-2h-2zM16 14h6v2h-6z" fill="var(--screen-ink)"/>
</symbol>
<symbol id="journey-landscape" viewBox="0 0 192 256">
 <path d="M0 0h192v256H0z" fill="var(--scene-sky)"/>
 <path d="M6 30h12v-4h10v-6h12v6h10v8h12v4H6zM138 18h10v-6h10v-4h10v10h12v6h12v4h-54zM0 70h16v-8h10v4h10v10H0z" fill="var(--scene-cloud)"/>
 <path d="M0 110h8V94h10V80h6V70h10V54h8V44h6V34h8v12h8v16h10v8h6v14h10v10h6v12h16V90h8V76h10V66h6V50h8V42h8v12h6v14h10v10h8v12h10v12h6v154H0z" fill="var(--mountain-back)"/>
 <path d="M48 34h8v12h8v16h10v8h6v14H68V72h-8V60H48zM144 42h8v12h6v14h10v10h8v12h-14V78h-10V62h-8z" fill="var(--mountain-snow)"/>
 <!-- A broad stepped mountain, with exposed faces between the trail's terraces. -->
 <path d="M18 236h10v-40h10v-36h12v-28h12v-24h12V88h10V68h8V46h10V24h20v14h10v18h10v20h10v24h10v28h10v28h10v28h10v72H18z" fill="var(--mountain-front)"/>
 <path d="M122 38h10v18h10v20h10v24h10v28h10v28h10v28h10v72h-24v-40h-12v-38h-10v-36h-10v-32h-8V82h-6z" fill="var(--scene-ground)"/>
 <path d="M126 64h8v14h8v24h10v30h10v30h10v34h10v28h10v32h-12v-32h-10v-28h-10v-34h-10v-30h-10v-30h-10V80h-4z" fill="var(--rock-face)"/>
 <path d="M132 82h4v4h2v4h-4v4h-2zM142 142h4v4h2v4h-6zM154 208h4v2h2v6h-4v-4h-2z" fill="var(--rock-light)"/>
 <path d="M58 118h24v8h20v8h24v8h16v22h-10v-12h-18v-10H92v-10H70v24H58zM42 170h22v8h20v8h24v10h24v22h-12v-12h-24v-10H74v-10H54v26H42z" fill="var(--rock-face)"/>
 <path d="M62 128h6v4h-2v6h-4zM98 140h6v2h2v4h-4v2h-4zM46 182h6v4h-2v6h-4zM94 196h8v2h-4v4h-4z" fill="var(--rock-light)"/>
 <path d="M58 116h24v6h20v8h24v8h16v6h-20v-8h-24v-8H78v-6H58zM42 168h22v6h20v8h24v10h24v6h-28v-10H80v-8H60v-6H42z" fill="var(--grass)"/>
 <path d="M0 240h18v-8h22v-12h24v12h28v8h26v-10h26v10h24v8h24v8H0z" fill="var(--scene-ground)"/>
 <use href="#journey-crest" width="192" height="256" style="--crest-trail-opacity:0"/>
 ${lichen}
 <g mask="url(#journey-trail-fade)">
 <path d="${pixelLine(ascent)}" fill="var(--journey-trail-edge, #b99151)" stroke="var(--journey-trail-edge, #b99151)" stroke-width="4"/>
 <path d="${pixelLine(ascent)}" fill="var(--journey-trail, #edc77f)"/>
 </g>
 ${pines.map(([x, y, s]) => `<use href="#journey-pine" x="${x}" y="${y - 48 * s}" width="${24 * s}" height="${48 * s}"/>`).join('')}
 <path d="M42 238h34v4h10v6h4v8H32v-8h6v-6h4z" fill="#657368"/>
 <path d="M42 238h34v4h10v4H38v-4h4z" fill="#a7ac8b"/>
 <path d="M58 250h22v2H58z" fill="#394d42"/>
 <use href="#journey-terminal" x="48" y="210" width="32" height="32"/>
</symbol>
`;
