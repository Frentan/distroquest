/** Editable pixel geometry. Coordinates use a two-unit grid; no raster or filters.
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
  [116, 28],
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

// Separated canopies; the terminal's rock and immediate background stay clear.
const pines = [
  [18, 136, 0.5],
  [36, 116, 1],
  [50, 158, 0.5],
  [160, 130, 1],
  [178, 164, 0.5],
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
const lichen = Array.from({ length: 65 }, (_, i) => {
  const y = 88 + ((i * 26) % 154);
  const x = 58 + ((i * 38) % 84);
  return `<path d="M${x} ${y}h${i % 3 === 0 ? 6 : 4}v2h-${i % 3 === 0 ? 6 : 4}z" fill="var(--grass)"/>`;
}).join('');

export const journeySymbols = `
<symbol id="journey-pine" viewBox="0 0 24 48">
 <path d="M10 36h4v12h-4z" fill="var(--tree-trunk)"/>
 <path d="M10 0h4v6h2v6h2v6h2v6h2v6h2v8H0v-8h2v-6h2v-6h2v-6h2V6h2z" fill="var(--tree)"/>
 <path d="M12 6h2v6h2v6h2v6h2v6h2v4H12v-6H8v-4h4v-6H8v-4h4z" fill="var(--tree-light)"/>
 <path d="M14 16h2v4h-2zM16 30h4v4h-4zM8 34h4v2H8z" fill="var(--grass)"/>
</symbol>
<symbol id="journey-traveler" viewBox="0 0 16 24">
 <path d="M4 0h6v2h2v6H4V6H2V2h2z" fill="#59412d"/>
 <path d="M6 4h6v4h2v2h-4v2H6z" fill="#e5b47a"/>
 <path d="M4 10h6v2h2v8H2v-8h2z" fill="#345e42"/>
 <path d="M2 12h4v8H0v-6h2z" fill="#273e2d"/>
 <path d="M2 14h2v4H2zM6 12h2v6H6z" fill="#72905a"/>
 <path d="M12 14h2v4h2v2h-4z" fill="#e5b47a"/>
 <path d="M4 18h8v4h-2v2H8v-4H6v4H2v-2h2z" fill="#263e50"/>
 <path d="M2 22h4v2H0v-2zM8 22h6v2H8z" fill="#875936"/>
</symbol>
<symbol id="journey-flag" viewBox="0 0 16 24">
 <path d="M2 0h2v24H2z" fill="#8a663c"/>
 <path d="M4 2h12v2h-2v2h-2v2h-2v2H4z" fill="#edc16a"/>
 <path d="M4 2h8v2H4z" fill="#ffe0a0"/>
</symbol>
<symbol id="journey-camp" viewBox="0 0 64 32">
 <path d="M0 28h4v-8h4v-8h4V4h8v8h4v8h4v8h4v4H0z" fill="#b84e43"/>
 <path d="M16 4h4v8h4v8h4v8h4v4H16z" fill="#d36b55"/>
 <path d="M12 20h4v-8h4v8h4v12H8v-4h4z" fill="#542f2c"/>
 <path d="M4 30h24v2H4z" fill="#8d463d"/>
 <path d="M42 28h6v2h10v2H42zM46 30h14v-2H46z" fill="#875936"/>
 <path d="M44 26h2v-6h4v-6h4v6h4v6h2v2H44z" fill="#d7803f"/>
 <path d="M48 24h2v-4h4v4h2v4h-8z" fill="#edc16a"/>
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
 <path d="M0 110h8V94h8V82h8V70h8V58h8V46h8V34h8v12h8v12h8v12h8v12h8v12h8v12h16V90h8V78h8V66h8V54h8V42h8v12h8v12h8v12h8v12h8v12h8v154H0z" fill="var(--mountain-back)"/>
 <path d="M48 34h8v12h8v12h8v12h8v12h8v12h8v14H84V96h-8V84h-8V72h-8V60H48zM144 42h8v12h8v12h8v12h8v12h8v12h8v10h-16V98h-8V86h-8V74h-8V62h-8z" fill="var(--mountain-snow)"/>
 <!-- A broad stepped mountain, with exposed faces between the trail's terraces. -->
 <path d="M18 236h10v-40h10v-36h12v-28h12v-24h12V88h10V68h8V46h10V24h20v14h10v18h10v20h10v24h10v28h10v28h10v28h10v72H18z" fill="var(--mountain-front)"/>
 <path d="M122 38h10v18h10v20h10v24h10v28h10v28h10v28h10v72h-24v-40h-12v-38h-10v-36h-10v-32h-8V82h-6z" fill="var(--scene-ground)"/>
 <path d="M126 64h8v14h8v24h10v30h10v30h10v34h10v28h10v32h-12v-32h-10v-28h-10v-34h-10v-30h-10v-30h-10V80h-4z" fill="#596963"/>
 <path d="M132 82h4v20h4v30h6v28h6v36h6v26h6v34h-6v-34h-6v-26h-6v-36h-6v-28h-6v-30h-2z" fill="#87907c"/>
 <path d="M58 118h24v8h20v8h24v8h16v22h-10v-12h-18v-10H92v-10H70v24H58zM42 170h22v8h20v8h24v10h24v22h-12v-12h-24v-10H74v-10H54v26H42z" fill="#596963"/>
 <path d="M64 126h4v20h-4zM82 132h4v14h-4zM100 142h4v12h-4zM48 180h4v26h-4zM70 186h4v18h-4zM94 196h4v14h-4zM116 206h4v10h-4z" fill="#87907c"/>
 <path d="M58 116h24v6h20v8h24v8h16v6h-20v-8h-24v-8H78v-6H58zM42 168h22v6h20v8h24v10h24v6h-28v-10H80v-8H60v-6H42z" fill="var(--grass)"/>
 <path d="M0 240h18v-8h22v-12h24v12h28v8h26v-10h26v10h24v8h24v8H0z" fill="var(--scene-ground)"/>
 ${lichen}
 <path d="${pixelLine(ascent)}" fill="var(--journey-trail-edge, #b99151)" stroke="var(--journey-trail-edge, #b99151)" stroke-width="4"/>
 <path d="${pixelLine(ascent)}" fill="var(--journey-trail, #edc77f)"/>
 ${pines.map(([x, y, s]) => `<use href="#journey-pine" x="${x}" y="${y - 48 * s}" width="${24 * s}" height="${48 * s}"/>`).join('')}
 <path d="M42 238h34v4h10v6h4v8H32v-8h6v-6h4z" fill="#657368"/>
 <path d="M42 238h34v4h10v4H38v-4h4z" fill="#a7ac8b"/>
 <path d="M58 250h22v2H58z" fill="#394d42"/>
 <use href="#journey-terminal" x="48" y="210" width="32" height="32"/>
</symbol>
`;
