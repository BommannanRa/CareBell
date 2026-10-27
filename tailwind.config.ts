import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF9F1',
        mint: '#EAF7F0',
        lavender: '#F0ECFF',
        sky: '#EAF4FF',
        peach: '#FFF0E6',
        text: '#1F2937',
        subtext: '#4B5563',
      },
      boxShadow: {
        soft: '0 10px 25px rgba(111, 118, 135, 0.14)',
      },
    },
  },
  plugins: [],
} satisfies Config;
