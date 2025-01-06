// vite.config.extension.js
export default {
  build: {
    rollupOptions: {
      input: {
        cta: "src/components/cta.jsx",
        content: "public/content.js",
      },
      output: {
        entryFileNames: "src/components/[cta|content].jsx|public/content.js",
      },
    },
  },
};
