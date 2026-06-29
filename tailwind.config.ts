import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        arkano: {
          black: "#0a0a0a",
          graphite: "#1c1c1c",
          gold: "#c9a24b",
          "gold-light": "#e4c878",
          champagne: "#ece2cf",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          // trilho tem 4 cópias da lista de marcas; andar 1/4 (uma cópia)
          // faz o loop fechar perfeitamente, sem espaço vazio no fim.
          "100%": { transform: "translateX(-25%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
