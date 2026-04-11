import type { MetadataRoute } from "next";

import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: "CLEP Humanities",
    description: APP_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#f6efe3",
    theme_color: "#b87333",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
