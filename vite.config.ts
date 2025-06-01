import { defineConfig } from "vite";
import path from "path";

// Use dynamic import for better compatibility
export default defineConfig(async () => {
  const react = await import('@vitejs/plugin-react');
  const runtimeErrorOverlay = await import('@replit/vite-plugin-runtime-error-modal').then(m => m.default);
  
  const plugins = [
    react.default(),
    runtimeErrorOverlay()
  ];

  // Conditionally add cartographer plugin in development with REPL_ID
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID) {
    const cartographer = await import('@replit/vite-plugin-cartographer');
    plugins.push(cartographer.cartographer());
  }
  
  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    publicDir: path.resolve(import.meta.dirname, "client/public"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(import.meta.dirname, "client/index.html"),
        },
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
    server: {
      port: 3000,
      strictPort: true,
    },
  };
});
