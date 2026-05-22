"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.2em",
            color: "#B61F26",
            textTransform: "uppercase",
          }}
        >
          App crashed
        </p>
        <h1
          style={{
            marginTop: 8,
            fontSize: 28,
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Something went wrong
        </h1>
        <p style={{ marginTop: 12, color: "#555", maxWidth: 420 }}>
          A fatal error stopped the app. Reload to try again.
        </p>
        {error.digest && (
          <p style={{ marginTop: 8, fontFamily: "monospace", fontSize: 10, color: "#888" }}>
            {error.digest}
          </p>
        )}
        <button
          onClick={() => reset()}
          style={{
            marginTop: 24,
            background: "#B61F26",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
