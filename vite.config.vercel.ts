import { defineConfig } from "vite";
import path from "path";

// Use dynamic import for better compatibility
export default defineConfig(async () => {
  const react = await import('@vitejs/plugin-react');
  
  return {
    plugins: [react.default()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    publicDir: path.resolve(__dirname, "client/public"),
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "client/index.html"),
        },
      },
    },
    server: {
      port: 3000,
      strictPort: true,
    },
  };
});
