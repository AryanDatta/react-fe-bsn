import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // base: "/react-fe-bsn",   // ← commented out for Vercel (not needed)
});
