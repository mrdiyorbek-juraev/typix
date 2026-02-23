import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  exampleSlug: z.string().min(1),
});

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Notification service not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { email, exampleSlug } = parsed.data;
  const fromEmail = process.env.NOTIFY_FROM_EMAIL ?? "notifications@typix.dev";

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Send confirmation to the subscriber
  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: `You're on the list — Typix "${exampleSlug}" example`,
    html: `
      <p>Hi there,</p>
      <p>Thanks for signing up! We'll let you know as soon as the
         <strong>${exampleSlug}</strong> example is live on
         <a href="https://typix.dev/examples">typix.dev/examples</a>.</p>
      <p>— The Typix team</p>
    `,
  });

  // Optionally notify the owner (non-fatal)
  if (process.env.NOTIFY_OWNER_EMAIL) {
    resend.emails
      .send({
        from: fromEmail,
        to: process.env.NOTIFY_OWNER_EMAIL,
        subject: `[Typix] New notify-me signup — ${exampleSlug}`,
        html: `<p><strong>${email}</strong> signed up for the <strong>${exampleSlug}</strong> example.</p>`,
      })
      .catch(() => {
        // Non-fatal — don't fail the request if owner email fails
      });
  }

  return NextResponse.json({ ok: true });
}
