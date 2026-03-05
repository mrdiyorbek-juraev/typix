import type { Preview, Decorator } from "@storybook/react";
import { useEffect } from "react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@typix-editor/theme";
import "@typix-editor/ui/styles";

// ── Theme decorator ────────────────────────────────────────────────────────
// Applies/removes `.dark` + `data-theme` on the preview <html> element so all
// CSS variables and component dark-mode selectors respond correctly.
const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals["colorScheme"] as string) ?? "light";
  const isDark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = isDark ? "dark" : "light";
    root.style.backgroundColor = isDark ? "#0c0a09" : "#ffffff";
  }, [isDark, theme]);

  return Story();
};

// ── Preview config ─────────────────────────────────────────────────────────
const preview: Preview = {
  // ── Global toolbar controls ───────────────────────────────────────────
  globalTypes: {
    colorScheme: {
      name: "Color scheme",
      description: "Toggle the preview between light and dark mode",
      defaultValue: "light",
      toolbar: {
        icon: "sun",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        dynamicTitle: true,
        showName: false,
      },
    },
  },

  // ── Decorators ────────────────────────────────────────────────────────
  decorators: [withTheme],

  // ── Parameters ────────────────────────────────────────────────────────
  parameters: {
    // Disable the built-in backgrounds toolbar (our theme toggle handles it)
    backgrounds: { disable: true },

    options: {
      storySort: {
        order: [
          "Design System",
          [
            "Overview",
            "Colors",
            "Spacing",
            "Radius",
            "Typography",
            "Shadow",
            "*",
          ],
          "UI",
          "*",
        ],
      },
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    docs: {
      // Make the docs canvas background also follow the theme
      story: { inline: true },
    },
  },
};

export default preview;
