import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    unstubGlobals: true, // restaura automáticamente los stubs tras cada test
  },
})
