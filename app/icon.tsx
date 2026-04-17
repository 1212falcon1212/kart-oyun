import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #FF6B35 0%, #E23D80 50%, #6A2CFF 100%)",
          borderRadius: 96,
        }}
      >
        <div
          style={{
            fontSize: 340,
            lineHeight: 1,
          }}
        >
          🔥
        </div>
      </div>
    ),
    size
  );
}
