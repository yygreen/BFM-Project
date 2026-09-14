import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // www, because that is the host the live site serves and every backlink and
  // ranking points at: the apex 301s to www today. This value drives every
  // canonical, the sitemap, hreflang and the JSON-LD, so an apex value here
  // would have pointed all of them at a host that redirects.
  site: "https://www.buyflightmiles.com",
  integrations: [sitemap()],
});
