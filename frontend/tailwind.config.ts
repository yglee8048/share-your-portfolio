import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f3f8f4',
          100: '#e4f0e6',
          200: '#c4dfc8',
          300: '#98c49e',
          400: '#6da876',
          500: '#4d8f58',
          600: '#3c7045',
          700: '#2d5533',
        },
      },
    },
  },
  plugins: [],
}

export default config
