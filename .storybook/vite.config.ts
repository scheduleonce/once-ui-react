import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { UserConfigExport } from 'vite';

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    plugins: [react()],
  });
};
// https://vitejs.dev/config/
export default app;
