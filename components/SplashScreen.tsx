"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const WORDS = ["O", "tempo", "é", "seu", "maior", "ativo."];

const PARTS = [
  { src: "/img/splash/simbolo-A.png",     key: "A" },
  { src: "/img/splash/arco-direito.png",  key: "R" },
  { src: "/img/splash/arco-inferior.png", key: "B" },
  { src: "/img/splash/arco-esquerdo.png", key: "L" },
];

export default function SplashScreen() {
  const [visibleWords, setVisibleWords]   = useState(0);
  const [wordsOpacity, setWordsOpacity]   = useState(1);
  const [partOpacity, setPartOpacity]     = useState([0, 0, 0, 0]);
  const [isZooming, setIsZooming]         = useState(false);
  const [containerOpacity, setContainerOpacity] = useState(1);
  const [done, setDone]                   = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const add = (fn: () => void, delay: number) => {
      timers.current.push(setTimeout(fn, delay));
    };

    // Palavras uma por uma
    WORDS.forEach((_, i) => {
      add(() => setVisibleWords(i + 1), 400 + i * 260);
    });

    // Palavras somem
    add(() => setWordsOpacity(0), 2200);

    // A aparece
    add(() => setPartOpacity([1, 0, 0, 0]), 2500);

    // Arco direito
    add(() => setPartOpacity([1, 1, 0, 0]), 2850);

    // Arco inferior
    add(() => setPartOpacity([1, 1, 1, 0]), 3150);

    // Arco esquerdo — logo completa
    add(() => setPartOpacity([1, 1, 1, 1]), 3450);

    // Zoom em direção ao usuário
    add(() => setIsZooming(true), 3950);

    // Tela some revelando o site
    add(() => setContainerOpacity(0), 4150);

    // Desmonta
    add(() => {
      document.body.style.overflow = "";
      setDone(true);
    }, 5100);

    return () => {
      timers.current.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#0a0a0a",
        display: "grid",
        placeItems: "center",
        opacity: containerOpacity,
        transition: containerOpacity === 0 ? "opacity 0.9s ease-in" : "none",
        pointerEvents: containerOpacity === 0 ? "none" : "auto",
      }}
    >
      {/* Slogan palavra por palavra */}
      <div
        style={{
          gridArea: "1 / 1",
          display: "flex",
          gap: "0.55em",
          justifyContent: "center",
          flexWrap: "wrap",
          opacity: wordsOpacity,
          transition: "opacity 0.5s ease",
        }}
      >
        {WORDS.map((word, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.6rem, 1.8vw, 0.8rem)",
              letterSpacing: "0.35em",
              color: "#ece2cf",
              textTransform: "uppercase",
              opacity: visibleWords > i ? 1 : 0,
              transform: visibleWords > i ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.45s ease, transform 0.45s ease",
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Símbolo em partes — mesma célula, sobreposto */}
      <div
        style={{
          gridArea: "1 / 1",
          position: "relative",
          width: 160,
          height: 160,
          transform: isZooming ? "scale(16)" : "scale(1)",
          filter: isZooming ? "blur(10px)" : "blur(0px)",
          transition: isZooming
            ? "transform 0.75s cubic-bezier(0.4, 0, 1, 1), filter 0.75s ease"
            : "none",
          transformOrigin: "center center",
          willChange: "transform, filter",
        }}
      >
        {PARTS.map(({ src, key }, i) => (
          <div
            key={key}
            style={{
              position: "absolute",
              inset: 0,
              opacity: partOpacity[i],
              transition: "opacity 0.35s ease",
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}
