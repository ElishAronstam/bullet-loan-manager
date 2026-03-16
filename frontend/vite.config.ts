import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const PORT = Number(process.env.PORT) || 4000;

export default defineConfig({
  plugins: [react()],
  server: {
    port: PORT,
  },
});
