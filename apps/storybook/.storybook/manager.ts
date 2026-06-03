import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

const typixTheme = create({
  base: "dark",

  // ── Brand ──────────────────────────────────────────────────────────────
  brandTitle: "Typix",
  brandImage: "/logo.svg",
  brandUrl: "/",
  brandTarget: "_self",

  // ── Accent ─────────────────────────────────────────────────────────────
  colorPrimary: "#2383e2",
  colorSecondary: "#2383e2",

  // ── App shell (stone palette) ───────────────────────────────────────────
  appBg: "#1c1917",
  appContentBg: "#161412",
  appPreviewBg: "#ffffff",
  appBorderColor: "#292524",
  appBorderRadius: 4,

  // ── Text ───────────────────────────────────────────────────────────────
  textColor: "#f5f5f4",
  textInverseColor: "#1c1917",
  textMutedColor: "#78716c",

  // ── Top toolbar ────────────────────────────────────────────────────────
  barTextColor: "#a8a29e",
  barHoverColor: "#f5f5f4",
  barSelectedColor: "#f5f5f4",
  barBg: "#0c0a09",

  // ── Form elements ──────────────────────────────────────────────────────
  inputBg: "#292524",
  inputBorder: "#44403c",
  inputTextColor: "#f5f5f4",
  inputBorderRadius: 4,

  // ── Buttons ────────────────────────────────────────────────────────────
  buttonBg: "#292524",
  buttonBorder: "#44403c",

  // ── Bool toggle ────────────────────────────────────────────────────────
  booleanBg: "#292524",
  booleanSelectedBg: "#2383e2",

  // ── Typography ─────────────────────────────────────────────────────────
  fontBase:
    '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: 'ui-monospace, "Cascadia Code", Menlo, monospace',
});

addons.setConfig({
  theme: typixTheme,
  sidebar: {
    showRoots: false,
  },
});
