import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: 'netlify',
    output: {
      dir: 'dist',
      publicDir: 'dist/public',
      serverDir: 'dist/server',
    },
  },
});