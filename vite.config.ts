import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, "./src"),
      assets: resolve(__dirname, "./src/assets"),
      components: resolve(__dirname, "./src/components"),
      constants: resolve(__dirname, "./src/constants"),
      cryptoBrowserify_5: 'rollup-plugin-node-polyfills/polyfills/crypto-browserify/cryptoBrowserify',
    },
  },
  plugins: [,
    nodePolyfills({
      // To exclude specific polyfills, add them to this list.
      exclude: [
        'fs', // Excludes the polyfill for `fs` and `node:fs`.
      ],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }), react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      plugins: [inject({ Buffer: ['Buffer', 'Buffer'] })],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  // parserOptions: {
  //   ecmaVersion: 'latest',
  //   sourceType: 'module',
  //   project: ['./tsconfig.json', './tsconfig.node.json'],
  //   tsconfigRootDir: __dirname,
  // },
});
