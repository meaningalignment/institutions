import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

// Bundles the markdown/YAML under data/ into the build as a virtual module, so
// content ships inside the (serverless) server bundle instead of being read
// from the filesystem at runtime. Reads happen at build time in Node, which
// works identically for the client and SSR passes (unlike import.meta.glob
// raw, which rolldown's SSR pass mishandles).
function siteContent(): Plugin {
  const VIRTUAL_ID = "virtual:site-content";
  const RESOLVED = "\0" + VIRTUAL_ID;
  const dataDir = path.join(process.cwd(), "data");

  const readMdDir = (sub: string): Record<string, string> => {
    const dir = path.join(dataDir, sub);
    const out: Record<string, string> = {};
    if (!fs.existsSync(dir)) return out;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".md")) out[f.replace(/\.md$/, "")] = fs.readFileSync(path.join(dir, f), "utf8");
    }
    return out;
  };

  const readRootFiles = (): Record<string, string> => {
    const out: Record<string, string> = {};
    if (!fs.existsSync(dataDir)) return out;
    for (const f of fs.readdirSync(dataDir)) {
      if (f.endsWith(".md") || f.endsWith(".yaml") || f.endsWith(".yml") || f.endsWith(".json")) {
        out[f] = fs.readFileSync(path.join(dataDir, f), "utf8");
      }
    }
    return out;
  };

  return {
    name: "site-content",
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED;
    },
    load(id) {
      if (id !== RESOLVED) return;
      const payload = {
        cells: readMdDir("cells"),
        methods: readMdDir("methods"),
        root: readRootFiles(),
      };
      return `export default ${JSON.stringify(payload)};`;
    },
    configureServer(server) {
      // Reload when content changes in dev.
      server.watcher.add(path.join(dataDir, "**/*"));
      server.watcher.on("all", (_event, file) => {
        if (file.startsWith(dataDir)) {
          const mod = server.moduleGraph.getModuleById(RESOLVED);
          if (mod) server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: "full-reload" });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [siteContent(), tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
