
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function removeConsoleLog() {
  return {
    name: 'remove-console-log',
    enforce: 'post' as const,
    transform(code :any, id :any) {
      if (process.env.NODE_ENV === 'production' && /\\.[jt]sx?$/.test(id)) {
        return {
          code: code.replace(/console\\.log\\([^;]*\\);?/g, ''),
          map: null,
        };
      }
      return null;
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(), removeConsoleLog()],
  preview: {
    port: 5173,
    strictPort: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    origin: "http://localhost:8090",
    allowedHosts: ["sae-frontend"]
  },
});