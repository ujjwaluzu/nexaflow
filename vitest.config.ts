import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'server-only': fileURLToPath(new URL('./tests/server-only.ts', import.meta.url)),
    },
  },
  plugins: [
    {
      name: 'mdx-content-test',
      transform(_code, id) {
        if (id.endsWith('.mdx'))
          return { code: 'export default function Content(){return null}', map: null };
      },
    },
  ],
  test: { include: ['tests/**/*.test.ts'], testTimeout: 30000 },
});
