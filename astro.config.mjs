import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";
import node from "@astrojs/node"; // Added node adapter
import robotsTxt from "astro-robots-txt";
import UnoCSS from "@unocss/astro";
import icon from "astro-icon";

import solidJs from "@astrojs/solid-js";
import { remarkReadingTime } from "./src/lib/remark-reading-time.mjs";

import svelte from "@astrojs/svelte";
import react from "@astrojs/react";

const adapter = process.env.BST_ADAPTER === "node"
  ? node({ mode: "standalone" })
  : netlify({ edgeMiddleware: true });

// https://astro.build/config
export default defineConfig({
  site: "https://gianmarcocavallo.com/",
  integrations: [
    sitemap(),
    robotsTxt({
      sitemap: [
        "https://gianmarcocavallo.com/sitemap-index.xml",
        "https://gianmarcocavallo.com/sitemap-0.xml",
      ],
    }),
    solidJs({ exclude: ['**/components/react/**'] }),
    UnoCSS({ injectReset: true }),
    icon(),
    svelte(),
    react({ include: ['**/components/react/**'] }),
  ],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  output: "server",
  adapter: adapter,
  vite: {
    assetsInclude: "**/*.riv",
  },
});
