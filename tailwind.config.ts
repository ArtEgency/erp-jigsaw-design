import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#565DFF",
          hover: "#4048CC",
        },
        sa: {
          primary: "#FF6B00",
          hover: "#CC5500",
        },
        erp: {
          bg: "#F4F4F4",
          text: "#333333",
          muted: "#777777",
          border: "#E0E0E0",
          sidebar: "#2D2D2D",
          nav: "#12121f",
          body: "#2c2c3a",
          error: "#E53935",
          success: "#3B6D11",
          warning: "#854F0B",
        },
      },
      fontFamily: {
        sans: ['"Sarabun"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
