import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [react()],
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify("http://127.0.0.1:1"),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY":
      JSON.stringify("isolated-ui-only"),
  },
  server: {
    host: "127.0.0.1",
    port: 4174,
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL("../..", import.meta.url))] },
  },
});
