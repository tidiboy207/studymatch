/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matcha: {
          forest: '#365C4A',       // Deep Forest Green chủ đạo
          forestDark: '#264234',
          forestLight: '#46725D',
          green: '#A7B99A',        // Matcha Green điểm nhấn/lịch rảnh
          greenLight: '#C3D4B7',
          greenSoft: '#E8EFE5',
          cream: '#F8F5EE',        // Warm Cream nền chính
          creamDark: '#EBE8DF',    // Kem xám dịu
          creamMuted: '#DFDACF',
          caramel: '#D89C57',      // Vàng caramel nhãn/huy hiệu
          caramelHover: '#C68B45',
          caramelSoft: '#FAEFDF',
          espresso: '#553F35',     // Nâu cà phê văn bản/tiêu đề phụ
          espressoLight: '#7A5E51',
          espressoMuted: '#8E7366',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        discipline: {
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
