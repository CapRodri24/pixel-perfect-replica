import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // o el plugin que uses
import path from "path";
import tailwindcss from "@tailwindcss/vite"; // <-- IMPORTAR

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    tailwindcss(), // <-- AÑADIR AQUÍ
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));