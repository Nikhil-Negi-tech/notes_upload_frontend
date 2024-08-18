import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (e.g., 'development', 'production')
  const env = process.env[`VITE_PORT`] || 3000;

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Bind to all IP addresses
      port: env // Use the port from the environment variable or default to 3000
    }
  };
});
