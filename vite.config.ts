import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// NO importes './server' aquí

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared", "./"],
      deny: [".env", ".env.", ".{crt,pem}", "/.git/", "server/**"],
    },
    proxy: {
      '/api': 'http://localhost:8080/'
    }
  },
  build: {
    outDir: "dist/spa",
    // Elimina las opciones de 'commonjsOptions' y 'rollupOptions'
    // que intentaban empaquetar 'mongodb'.
    // El build del cliente no debe saber nada de mongodb.
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    }
  },
  plugins: [react(), expressPlugin()],
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Correcto: solo se aplica en desarrollo
    configureServer(server) {
      // Importa el servidor SÓLO dentro de esta función
      // para que no contamine el build de producción
      import("./server").then(({ createServer }) => {
        const app = createServer();
        server.middlewares.use(app);
      }).catch(err => {
        console.error("Error al cargar el servidor express:", err);
      });
    },
  };
}