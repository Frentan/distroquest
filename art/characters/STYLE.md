# DistroQuest character style

The current 29 PNGs define the character set. Preserve their designs and original
coloring; future passes should address specific defects rather than redraw the cast.
See [ROSTER.md](ROSTER.md) for filenames.

## Visual rules

- Chunky FF1-plus / early-SNES-inspired pixel characters with clear dark outlines,
  stepped edges, readable silhouettes, and restrained shading.
- One isolated full-body character, normally facing right in three-quarter view.
  Keep the existing pose, proportions, equipment, and distinctive cues.
- No mouth. Visible white in the eyes, with simple expressions.
- Preserve each character's palette, saturation, brightness, contrast, and deep
  shadows. A cleanup must not make the colors lighter or washed out.
- Favor solid pixel clusters over soft gradients, fuzzy borders, and color noise.
  Keep the existing apparent pixel size and detail; do not coarsen the sprites.
- Use silhouette, palette, class, and props to distinguish characters. Preserve
  existing accessories during cleanup. For new designs, favor one main prop and
  an optional secondary prop, without ornamental clutter.
- Transparent background, with no scene, ground shadow, frame, label, text, or
  baked checkerboard. No sprite sheets.
- Do not reproduce, trace, embed, or closely imitate official distro logos or
  trademarks. Use original visual cues instead.

## Files and display

- Shipped assets: **512 × 512 RGBA PNG**, with transparency, in
  `public/characters/<distro-id>.png`.
- The primary recommendation displays one character at 256 pixels above a
  760-pixel viewport width and 144 pixels at narrower widths (112 pixels at
  widths of 360 pixels or less). The compact header places the wrapped distro
  name and archetype beside the character. Alternatives remain text-only.
- Preserve aspect ratio and use `image-rendering: pixelated`. Retain the whole
  canvas; do not stretch or crop equipment to equalize silhouette widths.
- Maintain comparable character scale and foot baseline while allowing natural
  differences in hair, capes, weapons, and props.
- The image is decorative beside the distro name and archetype, so it has an
  empty alt attribute. If loading fails, the artwork slot collapses.

## Editing the set

Keep source originals unchanged. Save a proposed edit separately and compare it
with the current sprite on light and dark backgrounds before replacing that
individual asset. Do not regenerate the whole set from older masters: that would
overwrite the accepted manual edits.

Garuda has the widest, busiest silhouette, Void has the darkest palette, and
Fedora KDE has fine equipment detail. Check these in the actual result UI when
changing rendering or sizing. Preserve their distinctions and avoid clipping.
