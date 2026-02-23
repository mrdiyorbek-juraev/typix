/**
 * Modern SVG illustration generators.
 * Each function receives:
 *   c  – main element colour (slate-500 light / slate-400 dark)
 *   a  – accent colour     (emerald-500 light / emerald-400 dark)
 * Returns a complete, standalone SVG string (320 × 200).
 */

// ─── canvas & window constants ───────────────────────────────────────────────

const VW = 320;
const VH = 200;

// App-window frame
const WX = 12, WY = 8, WW = 296, WH = 184, WR = 12;
const CH = 26; // chrome height

// Content area (inside window, below chrome)
const CX = WX + 8;                // 20
const CY = WY + CH + 8;          // 42
const CW = WW - 16;              // 280
const CB = WY + WH - 8;          // 184

// ─── low-level helpers ────────────────────────────────────────────────────────

/** Wrap all content in a root <svg> */
const svg = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${VW}" height="${VH}" viewBox="0 0 ${VW} ${VH}" fill="none">${inner}</svg>`;

interface RectOpts {
  rx?: number;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeDash?: string;
  opacity?: number;
}

const r = (x: number, y: number, w: number, h: number, o: RectOpts = {}) => {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}"`;
  if (o.rx   != null) s += ` rx="${o.rx}"`;
  if (o.fill)         s += ` fill="${o.fill}"`;
  if (o.fillOpacity  != null) s += ` fill-opacity="${o.fillOpacity}"`;
  if (o.stroke)       s += ` stroke="${o.stroke}"`;
  if (o.strokeWidth  != null) s += ` stroke-width="${o.strokeWidth}"`;
  if (o.strokeOpacity!= null) s += ` stroke-opacity="${o.strokeOpacity}"`;
  if (o.strokeDash)   s += ` stroke-dasharray="${o.strokeDash}"`;
  if (o.opacity      != null) s += ` opacity="${o.opacity}"`;
  return s + "/>";
};

const circle = (cx: number, cy: number, rad: number, fill: string, op: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${fill}" opacity="${op}"/>`;

const line = (x1: number, y1: number, x2: number, y2: number, stroke: string, op: number, w = 1) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" opacity="${op}"/>`;

/** Thin rounded bar representing a line of text */
const bar = (x: number, y: number, w: number, fill: string, op: number, h = 6, rx = 3) =>
  r(x, y, w, h, { rx, fill, op: undefined, opacity: op } as RectOpts & { op?: number });

// biome-ignore lint: the bar helper above passes opacity correctly but TS needs the cast
const b = (x: number, y: number, w: number, fill: string, op: number, h = 6, rx = 3) =>
  r(x, y, w, h, { rx, fill, opacity: op });

// ─── shared chrome ────────────────────────────────────────────────────────────

/**
 * Renders the app-window frame + chrome bar + traffic-light dots.
 * Content starts at y = CY (42).
 */
const chrome = (c: string) => [
  // outer frame
  r(WX, WY, WW, WH, { rx: WR, fill: c, fillOpacity: 0.03, stroke: c, strokeWidth: 1, strokeOpacity: 0.2 }),
  // chrome bar (top rounded, squared bottom using two overlapping rects)
  r(WX, WY,       WW, CH,    { rx: WR, fill: c, fillOpacity: 0.08 }),
  r(WX, WY + CH/2, WW, CH/2, {         fill: c, fillOpacity: 0.08 }),
  // chrome divider
  line(WX, WY + CH, WX + WW, WY + CH, c, 0.1),
  // traffic lights
  circle(WX + 14, WY + 13, 3.5, c, 0.5),
  circle(WX + 27, WY + 13, 3.5, c, 0.35),
  circle(WX + 40, WY + 13, 3.5, c, 0.2),
].join("");

/**
 * Toolbar strip with small icon-button placeholders.
 * `active` = indices (0-based) of buttons to fill with accent colour.
 * Layout: [undo, redo] | [B, I, U, S] | [H1, H2] | [code, quote, list]
 */
const toolbar = (c: string, a: string, active: number[] = []) => {
  // x positions for each button
  const btns = [
    { x: CX,      w: 12 }, // 0 undo
    { x: CX + 16, w: 12 }, // 1 redo
    // sep
    { x: CX + 36, w: 12 }, // 2 B
    { x: CX + 52, w: 12 }, // 3 I
    { x: CX + 68, w: 12 }, // 4 U
    { x: CX + 84, w: 12 }, // 5 S
    // sep
    { x: CX + 104, w: 14 }, // 6 H1
    { x: CX + 122, w: 14 }, // 7 H2
    // sep
    { x: CX + 144, w: 12 }, // 8 code
    { x: CX + 160, w: 12 }, // 9 quote
    { x: CX + 176, w: 12 }, // 10 list
  ];
  const sepXs = [CX + 30, CX + 98, CX + 138];
  const btnY = CY + 5, btnH = 10;

  return [
    ...sepXs.map(sx => line(sx, CY + 3, sx, CY + 19, c, 0.15)),
    ...btns.map(({ x, w }, i) => {
      const isActive = active.includes(i);
      return r(x, btnY, w, btnH, { rx: 3, fill: isActive ? a : c, opacity: isActive ? 0.9 : 0.28 });
    }),
    line(WX, CY + 22, WX + WW, CY + 22, c, 0.08),
  ].join("");
};

const TOOLBAR_H = 22; // vertical space consumed by toolbar

// ─── individual illustration generators ──────────────────────────────────────

export type IllustrationFn = (c: string, a: string) => string;

export const illustrationSvgs: Record<string, IllustrationFn> = {

  // ── 1. Default editor ────────────────────────────────────────────────────
  "default-editor": (c, a) => svg([
    chrome(c),
    toolbar(c, a, [2]), // B active
    // title line (taller, bolder)
    b(CX, CY + TOOLBAR_H + 8,  180, c, 0.55, 8, 4),
    // body lines
    b(CX, CY + TOOLBAR_H + 24, 256, c, 0.28),
    b(CX, CY + TOOLBAR_H + 35, 230, c, 0.25),
    b(CX, CY + TOOLBAR_H + 46, 200, c, 0.22),
    b(CX, CY + TOOLBAR_H + 57, 240, c, 0.2),
    b(CX, CY + TOOLBAR_H + 68, 140, c, 0.18),
    // blinking cursor
    r(CX + 144, CY + TOOLBAR_H + 66, 2, 12, { rx: 1, fill: a, opacity: 0.8 }),
  ].join("")),

  // ── 2. Formatting ───────────────────────────────────────────────────────
  formatting: (c, a) => svg([
    chrome(c),
    toolbar(c, a, [2, 3, 4]), // B I U active
    // selected text block (highlighted)
    r(CX, CY + TOOLBAR_H + 8, 220, 18, { rx: 4, fill: a, fillOpacity: 0.12, stroke: a, strokeWidth: 1, strokeOpacity: 0.3 }),
    b(CX + 6, CY + TOOLBAR_H + 12, 200, a, 0.5),
    // body text
    b(CX, CY + TOOLBAR_H + 34, 256, c, 0.25),
    b(CX, CY + TOOLBAR_H + 45, 200, c, 0.22),
    b(CX, CY + TOOLBAR_H + 56, 220, c, 0.2),
    b(CX, CY + TOOLBAR_H + 67, 160, c, 0.18),
    // floating format pill above selection
    r(CX + 40, CY + TOOLBAR_H - 12, 120, 20, { rx: 6, fill: c, fillOpacity: 0.08, stroke: c, strokeWidth: 1, strokeOpacity: 0.2 }),
    ...([0,1,2,3].map(i => r(CX + 52 + i * 16, CY + TOOLBAR_H - 6, 10, 8, { rx: 2, fill: i < 2 ? a : c, opacity: i < 2 ? 0.7 : 0.25 }))),
  ].join("")),

  // ── 3. Auto Link ─────────────────────────────────────────────────────────
  "auto-link": (c, a) => svg([
    chrome(c),
    b(CX, CY + 8, 160, c, 0.28),
    // URL line in accent colour with underline
    b(CX, CY + 22, 80, c, 0.28),
    b(CX + 84, CY + 22, 130, a, 0.7),
    r(CX + 84, CY + 30, 130, 1.5, { rx: 0.75, fill: a, opacity: 0.5 }),
    b(CX + 220, CY + 22, 60, c, 0.25),
    b(CX, CY + 36, 200, c, 0.22),
    b(CX, CY + 50, 160, c, 0.2),
    // chain-link icon (right side)
    `<path d="M248 88 C248 84 252 80 256 80 L263 80 C267 80 271 84 271 88 C271 92 267 96 263 96 L261 96" stroke="${a}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>`,
    `<path d="M259 96 C259 100 255 104 251 104 L244 104 C240 104 236 100 236 96 C236 92 240 88 244 88 L246 88" stroke="${a}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>`,
    line(248, 96, 260, 88, a, 0.45, 1.5),
  ].join("")),

  // ── 4. Context Menu ──────────────────────────────────────────────────────
  "context-menu": (c, a) => svg([
    chrome(c),
    b(CX, CY + 8, 200, c, 0.22),
    b(CX, CY + 20, 160, c, 0.18),
    b(CX, CY + 32, 180, c, 0.15),
    // menu popup
    r(CX + 80, CY + 14, 160, 110, { rx: 8, fill: c, fillOpacity: 0.07, stroke: c, strokeWidth: 1.5, strokeOpacity: 0.22 }),
    // menu items
    ...[0,1,2,3].map(i => {
      const my = CY + 28 + i * 21;
      const sel = i === 0;
      return [
        sel ? r(CX + 82, my - 3, 156, 17, { rx: 4, fill: a, fillOpacity: 0.12 }) : "",
        r(CX + 98, my + 3, 80 - i * 8, 6, { rx: 3, fill: sel ? a : c, opacity: sel ? 0.8 : 0.28 }),
        // icon placeholder
        r(CX + 86, my + 2, 8, 8, { rx: 2, fill: sel ? a : c, opacity: sel ? 0.5 : 0.2 }),
      ].join("");
    }),
    line(CX + 88, CY + 106, CX + 228, CY + 106, c, 0.12),
    r(CX + 98, CY + 112, 60, 6, { rx: 3, fill: c, opacity: 0.2 }),
  ].join("")),

  // ── 5. Character Limit ────────────────────────────────────────────────────
  "character-limit": (c, a) => svg([
    chrome(c),
    toolbar(c, a, []),
    b(CX, CY + TOOLBAR_H + 8,  240, c, 0.3),
    b(CX, CY + TOOLBAR_H + 20, 220, c, 0.27),
    b(CX, CY + TOOLBAR_H + 32, 200, c, 0.24),
    b(CX, CY + TOOLBAR_H + 44, 170, c, 0.22),
    b(CX, CY + TOOLBAR_H + 56, 140, c, 0.2),
    // progress track
    r(CX, CY + TOOLBAR_H + 74, CW, 8, { rx: 4, fill: c, fillOpacity: 0.1 }),
    // progress fill — ~78%
    r(CX, CY + TOOLBAR_H + 74, Math.round(CW * 0.78), 8, { rx: 4, fill: a, opacity: 0.75 }),
    // count badge
    r(CX + CW - 52, CY + TOOLBAR_H + 88, 52, 14, { rx: 7, fill: a, fillOpacity: 0.12, stroke: a, strokeWidth: 1, strokeOpacity: 0.35 }),
    b(CX + CW - 44, CY + TOOLBAR_H + 92, 36, a, 0.6, 6, 3),
  ].join("")),

  // ── 6. Max Length ─────────────────────────────────────────────────────────
  "max-length": (c, a) => svg([
    chrome(c),
    toolbar(c, a, []),
    b(CX, CY + TOOLBAR_H + 8,  CW, c, 0.3),
    b(CX, CY + TOOLBAR_H + 20, CW, c, 0.28),
    b(CX, CY + TOOLBAR_H + 32, CW, c, 0.26),
    b(CX, CY + TOOLBAR_H + 44, CW, c, 0.24),
    b(CX, CY + TOOLBAR_H + 56, 190, c, 0.22),
    // stop cursor (red/accent at end of last line)
    r(CX + 194, CY + TOOLBAR_H + 54, 2, 12, { rx: 1, fill: a, opacity: 0.9 }),
    // full progress bar (limit reached)
    r(CX, CY + TOOLBAR_H + 74, CW, 8, { rx: 4, fill: c, fillOpacity: 0.08 }),
    r(CX, CY + TOOLBAR_H + 74, CW, 8, { rx: 4, fill: a, opacity: 0.85 }),
    // "MAX" badge
    r(CX + CW - 42, CY + TOOLBAR_H + 88, 42, 14, { rx: 7, fill: a, fillOpacity: 0.18, stroke: a, strokeWidth: 1, strokeOpacity: 0.5 }),
    b(CX + CW - 34, CY + TOOLBAR_H + 92, 26, a, 0.7, 6, 3),
  ].join("")),

  // ── 7. Tab Focus ──────────────────────────────────────────────────────────
  "tab-focus": (c, a) => svg([
    // outer focus ring (accent)
    r(WX - 3, WY - 3, WW + 6, WH + 6, { rx: WR + 3, stroke: a, strokeWidth: 2, strokeOpacity: 0.5 }),
    chrome(c),
    b(CX, CY + 8,  180, c, 0.3),
    b(CX, CY + 22, 240, c, 0.26),
    b(CX, CY + 36, 200, c, 0.23),
    b(CX, CY + 50, 220, c, 0.2),
    b(CX, CY + 64, 160, c, 0.18),
    r(CX + 164, CY + 62, 2, 12, { rx: 1, fill: a, opacity: 0.8 }),
    // Tab key pill
    r(CX + CW/2 - 36, CY + 90, 72, 22, { rx: 8, fill: c, fillOpacity: 0.07, stroke: a, strokeWidth: 1.5, strokeOpacity: 0.4 }),
    b(CX + CW/2 - 22, CY + 97, 44, a, 0.6, 8, 4),
  ].join("")),

  // ── 8. Floating Link ──────────────────────────────────────────────────────
  "floating-link": (c, a) => svg([
    chrome(c),
    // editor text (below the floating popup)
    b(CX, CY + 56, 260, c, 0.22),
    // text selection (accent highlight)
    r(CX, CY + 70, 180, 16, { rx: 4, fill: a, fillOpacity: 0.13, stroke: a, strokeWidth: 1, strokeOpacity: 0.28 }),
    b(CX + 6, CY + 75, 160, a, 0.55),
    b(CX, CY + 94, 240, c, 0.2),
    b(CX, CY + 106, 180, c, 0.18),
    // floating popup (above selection)
    r(CX, CY + 8, 220, 36, { rx: 8, fill: c, fillOpacity: 0.08, stroke: c, strokeWidth: 1.5, strokeOpacity: 0.22 }),
    // link icon
    `<path d="M${CX+10} ${CY+28} C${CX+10} ${CY+25} ${CX+13} ${CY+22} ${CX+16} ${CY+22} L${CX+20} ${CY+22} C${CX+23} ${CY+22} ${CX+26} ${CY+25} ${CX+26} ${CY+28} C${CX+26} ${CY+31} ${CX+23} ${CY+34} ${CX+20} ${CY+34} L${CX+18} ${CY+34}" stroke="${a}" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/>`,
    `<path d="M${CX+22} ${CY+34} C${CX+22} ${CY+37} ${CX+19} ${CY+40} ${CX+16} ${CY+40} L${CX+12} ${CY+40} C${CX+9} ${CY+40} ${CX+6} ${CY+37} ${CX+6} ${CY+34} C${CX+6} ${CY+31} ${CX+9} ${CY+28} ${CX+12} ${CY+28} L${CX+14} ${CY+28}" stroke="${a}" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/>`,
    // URL input bar
    r(CX + 34, CY + 18, 174, 12, { rx: 4, fill: c, fillOpacity: 0.15, stroke: c, strokeWidth: 1, strokeOpacity: 0.2 }),
    b(CX + 40, CY + 21, 100, c, 0.35),
    // caret
    `<path d="M${CX+100} ${CY+44} L${CX+106} ${CY+52} L${CX+112} ${CY+44}" fill="${c}" opacity="0.2"/>`,
  ].join("")),

  // ── 9. Collapsible ────────────────────────────────────────────────────────
  collapsible: (c, a) => svg([
    chrome(c),
    // section 1 — expanded
    r(CX, CY + 4,  CW, 28, { rx: 6, fill: c, fillOpacity: 0.07, stroke: c, strokeWidth: 1, strokeOpacity: 0.18 }),
    `<path d="M${CX+10} ${CY+16} L${CX+16} ${CY+22} L${CX+22} ${CY+16}" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>`,
    b(CX + 30, CY + 13, 120, c, 0.5),
    b(CX + CW - 50, CY + 13, 40, a, 0.4, 6, 3),
    // section 1 content
    b(CX + 10, CY + 40, 250, c, 0.24),
    b(CX + 10, CY + 52, 220, c, 0.2),
    b(CX + 10, CY + 64, 180, c, 0.17),
    // section 2 — collapsed
    r(CX, CY + 82,  CW, 28, { rx: 6, fill: c, fillOpacity: 0.05, stroke: c, strokeWidth: 1, strokeOpacity: 0.13 }),
    `<path d="M${CX+10} ${CY+93} L${CX+16} ${CY+99} L${CX+10} ${CY+105}" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>`,
    b(CX + 30, CY + 91, 90, c, 0.3),
    // section 3 — collapsed (dimmer)
    r(CX, CY + 118, CW, 28, { rx: 6, fill: c, fillOpacity: 0.03, stroke: c, strokeWidth: 1, strokeOpacity: 0.09 }),
    `<path d="M${CX+10} ${CY+129} L${CX+16} ${CY+135} L${CX+10} ${CY+141}" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.18"/>`,
    b(CX + 30, CY + 127, 70, c, 0.18),
  ].join("")),

  // ── 10. Draggable Blocks ─────────────────────────────────────────────────
  "draggable-blocks": (c, a) => svg([
    chrome(c),
    ...[0, 1, 2].map(i => {
      const y     = CY + 4 + i * 52;
      const drag  = i === 1;
      const dots  = [0, 1].flatMap(col =>
        [0, 1, 2].map(row =>
          circle(CX + 6 + col * 6, y + 14 + row * 8, 1.8, drag ? a : c, drag ? 0.7 : 0.3)
        )
      ).join("");
      return [
        dots,
        r(CX + 18, y, CW - 18, 40, {
          rx: 6,
          fill: drag ? a : c, fillOpacity: drag ? 0.08 : 0.05,
          stroke: drag ? a : c, strokeWidth: drag ? 1.5 : 1,
          strokeOpacity: drag ? 0.4 : 0.15,
          strokeDash: drag ? "5 3" : undefined,
        }),
        b(CX + 30, y + 17, 140 - i * 20, drag ? a : c, drag ? 0.6 : 0.3),
        b(CX + 30 + (140 - i * 20) + 8, y + 17, 60 - i * 8, c, 0.18),
      ].join("");
    }),
  ].join("")),

  // ── 11. Images ───────────────────────────────────────────────────────────
  images: (c, a) => svg([
    chrome(c),
    // image frame
    r(CX + 20, CY + 4, CW - 40, 110, { rx: 8, stroke: c, strokeWidth: 1.5, strokeOpacity: 0.3 }),
    // subtle sky fill
    r(CX + 20, CY + 4, CW - 40, 110, { rx: 8, fill: c, fillOpacity: 0.03 }),
    // sun
    circle(CX + 48, CY + 26, 14, a, 0.25),
    // mountain landscape path
    `<path d="M${CX+20} ${CY+90} L${CX+75} ${CY+45} L${CX+110} ${CY+68} L${CX+150} ${CY+32} L${CX+220} ${CY+90}" stroke="${c}" stroke-width="1.5" opacity="0.3" fill="${c}" fill-opacity="0.06"/>`,
    // "image" icon overlay (centre)
    r(CX + 105, CY + 48, 50, 38, { rx: 6, stroke: a, strokeWidth: 1.5, strokeOpacity: 0.5 }),
    `<path d="M${CX+106} ${CY+78} L${CX+118} ${CY+63} L${CX+128} ${CY+72} L${CX+140} ${CY+57} L${CX+154} ${CY+78}" fill="${a}" opacity="0.2"/>`,
    circle(CX + 120, CY + 60, 5, a, 0.35),
    // caption text below image
    b(CX + 60, CY + 124, 160, c, 0.25, 6, 3),
    b(CX + 90, CY + 136, 100, c, 0.18, 6, 3),
  ].join("")),

  // ── 12. Code Editor ───────────────────────────────────────────────────────
  "code-editor": (c, a) => svg([
    chrome(c),
    // file tabs
    r(WX, WY + CH, 78, 20, { fill: c, fillOpacity: 0.08 }),
    r(WX, WY + CH + 18, 78, 2, { fill: a, fillOpacity: 0.9 }),   // active tab underline
    b(WX + 10, WY + CH + 7, 58, a, 0.7, 6, 3),
    r(WX + 78, WY + CH, 68, 20, { fill: c, fillOpacity: 0.04 }),
    b(WX + 88, WY + CH + 7, 48, c, 0.3, 6, 3),
    r(WX + 146, WY + CH, 68, 20, { fill: c, fillOpacity: 0.02 }),
    b(WX + 156, WY + CH + 7, 48, c, 0.2, 6, 3),
    line(WX, WY + CH + 20, WX + WW, WY + CH + 20, c, 0.1),
    // line numbers
    ...[0,1,2,3,4,5,6].map(i =>
      b(WX + 8, CY + 28 + i * 16, 12, c, 0.2, 6, 3)
    ),
    line(WX + 26, CY + 22, WX + 26, CB - 4, c, 0.1),
    // code lines (different widths = syntax variety)
    ...[
      { y: CY + 28, w: 40,  o: 0.55 },  // keyword
      { y: CY + 28, w: 0,   o: 0 },
      { y: CY + 44, w: 60,  o: 0.35 },  // indent + identifier
      { y: CY + 60, w: 80,  o: 0.4 },
      { y: CY + 76, w: 50,  o: 0.3 },
      { y: CY + 92, w: 110, o: 0.28 },
      { y: CY + 108, w: 70, o: 0.35 },
    ].map(({ y, w, o }) => w > 0 ? b(WX + 34, y, w, a, o) : ""),
    // secondary code bars
    b(WX + 82, CY + 28, 80, c, 0.25),
    b(WX + 90, CY + 44, 60, c, 0.22),
    b(WX + 90, CY + 60, 100, c, 0.2),
    b(WX + 110, CY + 76, 140, c, 0.18),
    b(WX + 114, CY + 92, 80,  c, 0.16),
    b(WX + 90, CY + 108, 50,  c, 0.22),
  ].join("")),

  // ── 13. Mentions ─────────────────────────────────────────────────────────
  mentions: (c, a) => svg([
    chrome(c),
    b(CX, CY + 8, 80, c, 0.28),
    // @mention pill
    r(CX + 86, CY + 4, 90, 18, { rx: 9, fill: a, fillOpacity: 0.15, stroke: a, strokeWidth: 1, strokeOpacity: 0.4 }),
    b(CX + 94, CY + 9, 74, a, 0.7),
    b(CX + 182, CY + 8, 80, c, 0.25),
    b(CX, CY + 28, 220, c, 0.22),
    // dropdown
    r(CX + 76, CY + 44, 160, 84, { rx: 8, fill: c, fillOpacity: 0.06, stroke: c, strokeWidth: 1.5, strokeOpacity: 0.2 }),
    ...[0,1,2].map(i => {
      const iy = CY + 56 + i * 22;
      const act = i === 0;
      return [
        act ? r(CX + 78, iy - 3, 156, 17, { rx: 4, fill: a, fillOpacity: 0.1 }) : "",
        circle(CX + 92, iy + 5, 7, act ? a : c, act ? 0.35 : 0.15),
        b(CX + 106, iy + 2, 70 - i * 10, act ? a : c, act ? 0.7 : 0.28),
        b(CX + 106 + 74 - i * 10, iy + 2, 20, c, 0.15),
      ].join("");
    }),
  ].join("")),

  // ── 14. Keywords ──────────────────────────────────────────────────────────
  keywords: (c, a) => svg([
    chrome(c),
    // line 1: text … KEYWORD … text
    b(CX, CY + 10, 56, c, 0.28),
    r(CX + 62, CY + 6, 82, 16, { rx: 4, fill: a, fillOpacity: 0.12, stroke: a, strokeWidth: 1, strokeOpacity: 0.3 }),
    b(CX + 68, CY + 11, 70, a, 0.7),
    b(CX + 150, CY + 10, 90, c, 0.25),
    // line 2: plain
    b(CX, CY + 32, 250, c, 0.22),
    // line 3: plain
    b(CX, CY + 46, 200, c, 0.2),
    // line 4: text … KEYWORD2 … text
    b(CX, CY + 62, 90, c, 0.25),
    r(CX + 96, CY + 58, 72, 16, { rx: 4, fill: a, fillOpacity: 0.12, stroke: a, strokeWidth: 1, strokeOpacity: 0.3 }),
    b(CX + 102, CY + 63, 60, a, 0.7),
    b(CX + 174, CY + 62, 80, c, 0.22),
    // line 5: plain
    b(CX, CY + 84, 180, c, 0.18),
    // legend/tag strip at bottom
    ...[0,1,2].map(i => r(CX + i * 66, CY + 104, 58, 14, { rx: 7, fill: a, fillOpacity: 0.08, stroke: a, strokeWidth: 1, strokeOpacity: 0.25 })),
  ].join("")),

  // ── 15. Markdown Shortcuts ────────────────────────────────────────────────
  "markdown-shortcuts": (c, a) => svg([
    chrome(c),
    // ## heading
    b(CX, CY + 8, 20, a, 0.6, 8, 3),   // ## token
    b(CX + 28, CY + 6, 160, c, 0.55, 12, 4), // heading bar (taller)
    // bold + italic inline
    b(CX, CY + 30, 50, c, 0.28),
    b(CX + 56, CY + 28, 70, c, 0.55, 10, 3), // bold (taller)
    b(CX + 132, CY + 30, 90, c, 0.28),
    // blockquote
    r(CX, CY + 50, 3, 30, { rx: 1.5, fill: a, opacity: 0.6 }),
    b(CX + 12, CY + 52, 200, c, 0.28),
    b(CX + 12, CY + 64, 170, c, 0.22),
    // inline code
    r(CX, CY + 90, 70, 16, { rx: 4, fill: c, fillOpacity: 0.1, stroke: c, strokeWidth: 1, strokeOpacity: 0.2 }),
    b(CX + 8, CY + 94, 54, a, 0.5, 8, 3),
    b(CX + 78, CY + 94, 120, c, 0.22),
    // horizontal rule
    line(CX, CY + 116, CX + CW, CY + 116, c, 0.15),
    b(CX, CY + 124, 180, c, 0.2),
  ].join("")),

  // ── 16. Tasks ─────────────────────────────────────────────────────────────
  tasks: (c, a) => svg([
    chrome(c),
    ...[0,1,2,3,4].map(i => {
      const ty    = CY + 4 + i * 34;
      const done  = i < 2;
      const check = done
        ? `<path d="M${CX+5} ${ty+13} L${CX+9} ${ty+17} L${CX+17} ${ty+9}" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`
        : "";
      return [
        r(CX, ty + 4, 20, 20, { rx: 4, fill: done ? a : "none", fillOpacity: done ? 0.15 : 0, stroke: done ? a : c, strokeWidth: 1.5, strokeOpacity: done ? 0.7 : 0.3 }),
        check,
        b(CX + 28, ty + 11, 160 - i * 12, done ? c : c, done ? 0.22 : 0.38),
        b(CX + 196 - i * 12, ty + 11, 60, c, 0.15),
      ].join("");
    }),
  ].join("")),

  // ── 17. Tables ────────────────────────────────────────────────────────────
  tables: (c, a) => svg([
    chrome(c),
    // table outer
    r(CX, CY + 4, CW, 130, { rx: 6, stroke: c, strokeWidth: 1.5, strokeOpacity: 0.22 }),
    // header row
    r(CX, CY + 4, CW, 24, { rx: 6, fill: c, fillOpacity: 0.08 }),
    // vertical dividers
    ...[1,2,3].map(i => line(CX + Math.round(CW * i/4), CY + 4, CX + Math.round(CW * i/4), CY + 134, c, 0.15)),
    // horizontal dividers (rows 1-4)
    ...[1,2,3,4].map(i => line(CX, CY + 4 + i*26, CX + CW, CY + 4 + i*26, c, i === 1 ? 0.2 : 0.1)),
    // header cell text
    ...[0,1,2,3].map(i => b(CX + Math.round(CW * i/4) + 8, CY + 12, Math.round(CW/4) - 16, a, 0.6, 6, 3)),
    // data cells
    ...[1,2,3,4].flatMap(row =>
      [0,1,2,3].map(col =>
        b(CX + Math.round(CW * col/4) + 8, CY + 4 + row*26 + 9, Math.round(CW/4) - 22 - (col + row) * 3, c, 0.22, 6, 3)
      )
    ),
  ].join("")),

  // ── 18. Minimal Note ──────────────────────────────────────────────────────
  "minimal-note": (c, a) => svg([
    // simple borderless frame — just a subtle outline
    r(WX, WY, WW, WH, { rx: WR, stroke: c, strokeWidth: 1, strokeOpacity: 0.12 }),
    // centered content
    b(60, 52, 200, c, 0.45, 10, 5),  // title
    b(80, 76, 160, c, 0.25),
    b(70, 90, 180, c, 0.22),
    b(85, 104, 150, c, 0.2),
    b(95, 118, 130, c, 0.17),
    b(100, 132, 120, c, 0.15),
    // cursor
    r(226, 130, 2, 14, { rx: 1, fill: a, opacity: 0.7 }),
    // bottom word count
    b(136, 158, 48, c, 0.18, 5, 2.5),
  ].join("")),

  // ── 19. AI Autocomplete ───────────────────────────────────────────────────
  "ai-autocomplete": (c, a) => svg([
    chrome(c),
    toolbar(c, a, []),
    b(CX, CY + TOOLBAR_H + 8,  220, c, 0.32),
    b(CX, CY + TOOLBAR_H + 20, 240, c, 0.28),
    b(CX, CY + TOOLBAR_H + 32, 110, c, 0.35),
    // ghost autocomplete continuation
    b(CX + 116, CY + TOOLBAR_H + 32, 130, a, 0.2),
    // cursor
    r(CX + 112, CY + TOOLBAR_H + 30, 2, 12, { rx: 1, fill: c, opacity: 0.7 }),
    // "Tab to accept" pill
    r(CX + 116, CY + TOOLBAR_H + 46, 86, 18, { rx: 9, fill: a, fillOpacity: 0.1, stroke: a, strokeWidth: 1, strokeOpacity: 0.4 }),
    b(CX + 126, CY + TOOLBAR_H + 51, 66, a, 0.6, 8, 4),
    // suggestion popup
    r(CX + 100, CY + TOOLBAR_H + 70, 160, 52, { rx: 8, fill: c, fillOpacity: 0.07, stroke: c, strokeWidth: 1, strokeOpacity: 0.18 }),
    ...[0,1,2].map(i => b(CX + 114, CY + TOOLBAR_H + 80 + i * 14, 120 - i * 20, i === 0 ? a : c, i === 0 ? 0.6 : 0.25)),
  ].join("")),

  // ── 20. Speech to Text ────────────────────────────────────────────────────
  "speech-to-text": (c, a) => svg([
    chrome(c),
    // microphone
    r(146, CY + 8, 28, 50, { rx: 14, fill: a, opacity: 0.35 }),
    `<path d="M130 ${CY+54} C130 ${CY+72} 190 ${CY+72} 190 ${CY+54}" stroke="${a}" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>`,
    line(160, CY + 72, 160, CY + 86, a, 0.45, 2.5),
    line(148, CY + 86, 172, CY + 86, a, 0.45, 2.5),
    // waveform bars (both sides of mic)
    ...[
      { x: 24, h: 20 }, { x: 38, h: 32 }, { x: 52, h: 44 }, { x: 66, h: 26 }, { x: 80, h: 38 }, { x: 94, h: 16 },
      { x: 224, h: 16 }, { x: 238, h: 38 }, { x: 252, h: 26 }, { x: 266, h: 44 }, { x: 280, h: 32 }, { x: 294, h: 20 },
    ].map(({ x, h }) =>
      r(x, CY + 30 - h/2, 9, h, { rx: 4.5, fill: a, opacity: +(0.15 + (h/44)*0.45).toFixed(2) })
    ),
    // transcription text
    b(CX + 30, CY + 106, 220, c, 0.3),
    b(CX + 50, CY + 118, 180, c, 0.22),
  ].join("")),

  // ── 21. AI Chat ───────────────────────────────────────────────────────────
  "ai-chat": (c, a) => svg([
    chrome(c),
    // user message (right-aligned)
    r(CX + 80, CY + 8, 200, 28, { rx: 10, fill: a, fillOpacity: 0.18, stroke: a, strokeWidth: 1, strokeOpacity: 0.3 }),
    b(CX + 92, CY + 17, 176, a, 0.65),
    // AI message (left-aligned)
    circle(CX + 10, CY + 58, 10, c, 0.2),
    r(CX + 26, CY + 46, 210, 38, { rx: 10, fill: c, fillOpacity: 0.06, stroke: c, strokeWidth: 1, strokeOpacity: 0.15 }),
    b(CX + 36, CY + 56, 180, c, 0.32),
    b(CX + 36, CY + 68, 150, c, 0.26),
    // second user message
    r(CX + 100, CY + 96, 180, 26, { rx: 10, fill: a, fillOpacity: 0.12, stroke: a, strokeWidth: 1, strokeOpacity: 0.22 }),
    b(CX + 110, CY + 105, 160, a, 0.5),
    // input bar
    r(CX, CY + 134, CW, 30, { rx: 15, fill: c, fillOpacity: 0.06, stroke: c, strokeWidth: 1.5, strokeOpacity: 0.22 }),
    b(CX + 16, CY + 144, 100, c, 0.22),
    // send button
    circle(CX + CW - 14, CY + 149, 11, a, 0.8),
    `<path d="M${CX+CW-20} ${CY+149} L${CX+CW-9} ${CY+149} M${CX+CW-14} ${CY+143} L${CX+CW-8} ${CY+149} L${CX+CW-14} ${CY+155}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`,
  ].join("")),

  // ── 22. Slack Messenger ───────────────────────────────────────────────────
  "slack-messenger": (c, a) => svg([
    chrome(c),
    // sidebar panel
    r(WX, WY + CH, 76, WH - CH, { fill: c, fillOpacity: 0.06 }),
    line(WX + 76, WY + CH, WX + 76, WY + WH, c, 0.12),
    // sidebar channels
    ...[
      { w: 52, active: true },
      { w: 44, active: false },
      { w: 48, active: false },
      { w: 38, active: false },
    ].map(({ w, active }, i) => {
      const sy = WY + CH + 12 + i * 22;
      return [
        active ? r(WX + 4, sy - 3, 68, 16, { rx: 4, fill: a, fillOpacity: 0.15 }) : "",
        b(WX + 10, sy, w, active ? a : c, active ? 0.75 : 0.28),
      ].join("");
    }),
    // messages area
    ...[0,1,2].map(i => {
      const my = WY + CH + 10 + i * 52;
      return [
        circle(WX + 94, my + 10, 9, c, 0.18),
        b(WX + 110, my + 4, 50, c, 0.4, 6, 3),
        b(WX + 110, my + 16, 160 - i * 20, c, 0.25),
        i < 2 ? b(WX + 110, my + 28, 120 - i * 20, c, 0.18) : "",
      ].join("");
    }),
    // input
    r(WX + 84, CB - 34, WW - 92, 26, { rx: 6, stroke: c, strokeWidth: 1.5, strokeOpacity: 0.22 }),
    b(WX + 96, CB - 24, 80, c, 0.2),
    r(WX + WW - 22, CB - 30, 18, 18, { rx: 4, fill: a, fillOpacity: 0.6 }),
  ].join("")),

  // ── 23. Comment Thread ────────────────────────────────────────────────────
  "comment-thread": (c, a) => svg([
    chrome(c),
    // comment 1
    circle(CX + 10, CY + 20, 11, c, 0.2),
    r(CX + 28, CY + 4, CW - 28, 40, { rx: 8, fill: c, fillOpacity: 0.06, stroke: c, strokeWidth: 1, strokeOpacity: 0.14 }),
    b(CX + 38, CY + 12, 50, c, 0.45, 6, 3),
    b(CX + 38, CY + 24, 180, c, 0.28),
    b(CX + 38, CY + 34, 140, c, 0.22),
    // reaction row
    ...[0,1,2].map(i =>
      r(CX + 28 + i * 38, CY + 50, 32, 14, { rx: 7, fill: i === 0 ? a : c, fillOpacity: i === 0 ? 0.12 : 0.06, stroke: i === 0 ? a : c, strokeWidth: 1, strokeOpacity: i === 0 ? 0.4 : 0.15 })
    ),
    // comment 2 (reply, slightly indented)
    circle(CX + 20, CY + 90, 9, c, 0.15),
    r(CX + 36, CY + 76, CW - 36, 34, { rx: 8, fill: c, fillOpacity: 0.04, stroke: c, strokeWidth: 1, strokeOpacity: 0.1 }),
    b(CX + 46, CY + 83, 40, c, 0.35, 6, 3),
    b(CX + 46, CY + 95, 150, c, 0.2),
    // input with focus ring (accent border)
    r(CX, CY + 120, CW, 30, { rx: 8, fill: c, fillOpacity: 0.04, stroke: a, strokeWidth: 1.5, strokeOpacity: 0.5 }),
    b(CX + 14, CY + 131, 90, c, 0.22),
    r(CX + CW - 34, CY + 124, 24, 22, { rx: 5, fill: a, opacity: 0.7 }),
  ].join("")),
};
