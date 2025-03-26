import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://kouxi.jp',
  integrations: [mdx(), sitemap(), tailwind(), react({include: ['**/react/*']})],
  viewTransitions: true,
  output: 'static',
  adapter: node({
    mode: "standalone"
  }),
});
