import { defineConfig, createLogger } from 'vite'
import vue from '@vitejs/plugin-vue'

const logger = createLogger()
const _warn = logger.warn
logger.warn = (msg, options) => {
  if (msg.includes('PLUGIN_TIMINGS')) return
  _warn(msg, options)
}

export default defineConfig({
  customLogger: logger,
  plugins: [vue()],
})
