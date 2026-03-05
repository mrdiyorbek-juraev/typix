import BasicEditor from "@/components/basic-editor";

export default function BasicPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Basic Editor</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A minimal editor using{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            EditorRoot
          </code>{" "}
          +{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            EditorContent
          </code>{" "}
          with core formatting.
        </p>
      </div>
      <BasicEditor />
    </div>
  );
}
