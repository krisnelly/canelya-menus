import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuration Vite standard pour une SPA React déployée sur Vercel.
// Les routes /api/* sont gérées par les fonctions serverless Vercel
// (dossier /api à la racine), pas par Vite — voir vercel.json.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // En local, redirige /api vers `vercel dev` (port 3000 par défaut)
      // si vous testez les fonctions serverless en même temps que le frontend.
      "/api": "http://localhost:3000",
    },
  },
});
