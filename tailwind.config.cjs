// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/modules/**/*.{js,ts,jsx,tsx}",
    ],
    theme: { extend: {} },
    plugins: {
      '@tailwindcss/postcss': {},
    },
    daisyui: {
      themes: ["dracula","vscode-light","blender","unity-dark"],
    },
  }
  