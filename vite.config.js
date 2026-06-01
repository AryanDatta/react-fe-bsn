import { defineConfig } from "vite";
import React from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: process.env.VITE_BASE_PATH || "/react-fe-bsn",
});