module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-red-500',
    'text-white',
    'p-20',
    'rounded-3xl',
    'shadow-2xl',
    'border-4',
    'border-white',
    'text-5xl',
    'font-extrabold',
    'mt-4',
    'text-xl',
    'min-h-screen',
    'flex',
    'items-center',
    'justify-center',
    'bg-teal-50'
  ],
  theme: {
    extend: {
      colors: {
        red: {
          500: '#ef4444',
        },
        teal: {
          50: '#f0fdfa',
          700: '#0f766e',
        },
        white: '#ffffff',
      },
    },
  },
  plugins: [],
};
