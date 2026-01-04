import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "TradeSmart - AI-Powered Multi-Asset Opportunity Scanner";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f1117",
        backgroundImage:
          "radial-gradient(circle at 25% 25%, #16A34A20 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16A34A10 0%, transparent 50%)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            backgroundColor: "#16A34A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            style={{ display: "flex" }}
          >
            <path
              d="M3 18L9 12L13 16L21 8"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="21" cy="8" r="1.5" fill="white" />
          </svg>
        </div>
        <span
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          TradeSmart
        </span>
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 32,
          color: "#16A34A",
          fontWeight: 600,
          marginBottom: 24,
        }}
      >
        Find Your Edge Across Markets
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 24,
          color: "#9ca3af",
          textAlign: "center",
          maxWidth: 800,
          lineHeight: 1.4,
        }}
      >
        AI-powered scanner for betting arbitrage, stock momentum, and crypto
        funding rates
      </div>

      {/* Markets */}
      <div
        style={{
          display: "flex",
          gap: 32,
          marginTop: 48,
        }}
      >
        {["Betting", "Stocks", "Crypto"].map((market) => (
          <div
            key={market}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              backgroundColor: "#16A34A20",
              borderRadius: 999,
              border: "1px solid #16A34A40",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#16A34A",
              }}
            />
            <span style={{ color: "white", fontSize: 18, fontWeight: 500 }}>
              {market}
            </span>
          </div>
        ))}
      </div>
    </div>,
    {
      ...size,
    },
  );
}
