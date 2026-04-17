import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kıvılcım",
    short_name: "Kıvılcım",
    description: "Arkadaş ortamı kart oyunu",
    start_url: "/",
    display: "standalone",
    background_color: "#0E0B14",
    theme_color: "#0E0B14",
    orientation: "portrait",
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
