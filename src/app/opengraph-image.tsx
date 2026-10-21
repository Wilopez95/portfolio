import { ImageResponse } from "next/og";

export const alt = "Wilson López — Full-Stack Engineer · AI-powered products & secure software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, #1e1e1e 0%, transparent 45%), linear-gradient(#161616 1px, transparent 1px), linear-gradient(90deg, #161616 1px, transparent 1px)",
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#a3a3a3", letterSpacing: 4 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#22c55e" }} />
          WILOPEZ.DEV
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>Wilson López</div>
          <div style={{ fontSize: 44, fontWeight: 600, color: "#d4d4d4" }}>Full-Stack Engineer</div>
          <div style={{ fontSize: 32, color: "#a3a3a3" }}>AI-powered products & secure software</div>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#666666" }}>
          {["React", "Next.js", "Spring Boot", "AWS"].map((tech) => (
            <div key={tech} style={{ display: "flex", padding: "8px 20px", border: "1px solid #262626", borderRadius: 999 }}>
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
