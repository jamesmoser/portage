/** @type {import('tailwindcss').Config} */

// ── Font configuration ────────────────────────────────────────────────────────
// To change fonts:
//   1. Install the new @fontsource-variable/<name> package
//   2. Update the @import lines in src/index.css
//   3. Update the family names below
// ─────────────────────────────────────────────────────────────────────────────
const fonts = {
  sans:    ['Inter Variable', 'system-ui', 'sans-serif'],   // UI / body / numbers
  display: ['Fraunces Variable', 'Georgia', 'serif'],       // brand / headings
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: fonts,
      colors: {
        slate: {
          850: '#1a2332',
        },
      },
    },
  },
  plugins: [],
}
