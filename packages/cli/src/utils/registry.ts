export type RegistryEntry = {
  name: string;
  description: string;
  files: string[];
  dependencies: string[];
  registryDependencies: string[];
};

export const registry: Record<string, RegistryEntry> = {
  "toolbar-button": {
    name: "toolbar-button",
    description: "Reusable toolbar button with active state styling",
    files: ["toolbar-button/toolbar-button.tsx"],
    dependencies: ["@typix-editor/react"],
    registryDependencies: [],
  },
};

export function getRegistryEntry(name: string): RegistryEntry | undefined {
  return registry[name];
}

export function getAllComponents(): RegistryEntry[] {
  return Object.values(registry);
}

export function getComponentNames(): string[] {
  return Object.keys(registry);
}
