import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kıvılcım - Arkadaş Ortamı Kart Oyunu",
  description:
    "100 soru, elden ele dolaşan telefon, ortamı kızıştıran sorular. Arkadaş ortamı için kart oyunu.",
  applicationName: "Kıvılcım",
  appleWebApp: {
    capable: true,
    title: "Kıvılcım",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0B14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
