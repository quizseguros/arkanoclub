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
          // azuis da campanha de Dia dos Pais — usados só na pronta entrega,
          // pra separar a promoção do dourado que é a cor permanente da marca
          navy: "#071633",
          "navy-light": "#0f2a5c",
          blue: "#2f6fd0",
          "blue-light": "#7db8ff",
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
