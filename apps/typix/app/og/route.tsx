import { ImageResponse } from "next/og";

export const runtime = "edge";
export const revalidate = false;

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#0A0A0A",
          display: "flex",
          overflow: "hidden",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Ambient glow — top-left purple */}
        <div
          style={{
            position: "absolute",
            top: "-180px",
            left: "-120px",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 68%)",
          }}
        />

        {/* Ambient glow — bottom-right blue */}
        <div
          style={{
            position: "absolute",
            bottom: "-160px",
            right: "160px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 68%)",
          }}
        />

        {/* Subtle border line at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.1) 60%, transparent 100%)",
          }}
        />

        {/* Left content column */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 56px 72px 80px",
            gap: "28px",
            zIndex: 1,
          }}
        >
          {/* Logo mark + brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  color: "#0A0A0A",
                  lineHeight: "1",
                }}
              >
                T
              </span>
            </div>
            <span
              style={{
                fontSize: "30px",
                fontWeight: "700",
                color: "#FFFFFF",
                letterSpacing: "-0.5px",
              }}
            >
              Typix
            </span>
          </div>

          {/* Main headline */}
          <div
            style={{
              fontSize: "62px",
              fontWeight: "800",
              color: "#FFFFFF",
              lineHeight: "1.06",
              letterSpacing: "-2px",
              maxWidth: "620px",
            }}
          >
            Extensible Rich Text Editor for React
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "20px",
              color: "#6B7280",
              lineHeight: "1.5",
              maxWidth: "560px",
            }}
          >
            Headless, modular editor built on Meta&apos;s Lexical. Install only
            the extensions you need.
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {["Headless", "Extension-based", "Type-safe", "Built on Lexical"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "100px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#9CA3AF",
                    fontSize: "15px",
                    backgroundColor: "rgba(255,255,255,0.04)",
                  }}
                >
                  {tag}
                </div>
              )
            )}
          </div>
        </div>

        {/* Right decorative column */}
        <div
          style={{
            width: "310px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 60px 60px 0",
            gap: "10px",
            zIndex: 1,
          }}
        >
          {/* Editor extension blocks mockup */}
          {[
            { label: "Auto Complete", color: "#A78BFA", w: 240 },
            { label: "Code Highlight", color: "#34D399", w: 210 },
            { label: "Mention", color: "#60A5FA", w: 175 },
            { label: "Draggable Block", color: "#F472B6", w: 228 },
            { label: "Floating Link", color: "#FB923C", w: 200 },
            { label: "Collapsible", color: "#FBBF24", w: 185 },
          ].map((block, i) => (
            <div
              key={block.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                width: `${block.w}px`,
                opacity: 1 - i * 0.1,
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: block.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: block.color, fontSize: "14px" }}>
                {block.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
