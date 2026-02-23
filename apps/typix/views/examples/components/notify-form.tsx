"use client";

import { Bell, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type State = "idle" | "loading" | "success" | "error";

interface NotifyFormProps {
  exampleSlug: string;
  exampleTitle: string;
}

export function NotifyForm({ exampleSlug, exampleTitle }: NotifyFormProps) {
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, exampleSlug }),
      });

      if (res.ok) {
        setState("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setState("error");
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted/50">
        <Bell className="size-6 text-muted-foreground" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <Badge variant="secondary" className="text-[11px] font-medium uppercase tracking-wider">
          Coming soon
        </Badge>
        <h2 className="font-semibold text-xl">{exampleTitle}</h2>
        <p className="max-w-xs text-muted-foreground text-sm leading-relaxed">
          This example is still being built. Enter your email and we'll notify
          you when it's ready.
        </p>
      </div>

      {state === "success" ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-600 text-sm dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>You're on the list! We'll notify you when this example is ready.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={state === "loading"}
              className="flex h-9 flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button type="submit" size="sm" disabled={state === "loading"}>
              {state === "loading" ? "Sending…" : "Notify me"}
            </Button>
          </div>
          {state === "error" && (
            <div className="flex items-center gap-1.5 text-destructive text-xs">
              <XCircle className="size-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
