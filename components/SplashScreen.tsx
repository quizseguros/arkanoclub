"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const WORDS = ["O", "tempo", "é", "seu", "maior", "ativo."];

export default function SplashScreen() {
  const [visibleWords, setVisibleWords] = useState(0);
  const [wordsOpacity, setWordsOpacity] = useState(1);
  const [logoOpacity, setLogoOpacity]   = useState(0);
  const [logoScale, setLogoScale]       = useState(0.85);
  const [isZooming, setIsZooming]       = useState(false);
  const [containerOpacity, setContainerOpacity] = useState(1);
  const [done, setDone]                 = useState(false);
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
    // Última palavra: 400 + 5×260 = 1700ms

    // Palavras somem
    add(() => setWordsOpacity(0), 2200);

    // Logo aparece com escala suave
    add(() => {
      setLogoOpacity(1);
      setLogoScale(1);
    }, 2500);

    // Logo avança (zoom em direção ao usuário)
    add(() => {
      setIsZooming(true);
      setLogoScale(14);
    }, 3500);

    // Tela some revelando o site
    add(() => setContainerOpacity(0), 3700);

    // Desmonta
    add(() => {
      document.body.style.overflow = "";
      setDone(true);
    }, 4700);

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
        transition: containerOpacity === 0 ? "opacity 1s ease" : "none",
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

      {/* Símbolo — mesma célula, aparece e avança */}
      <div
        style={{
          gridArea: "1 / 1",
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          transition: isZooming
            ? "transform 0.85s cubic-bezier(0.4, 0, 1, 1)"
            : "opacity 0.7s ease, transform 0.7s ease",
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      >
        <Image
          src="/img/identidade/simbolo-dourado.png"
          alt="Arkano Club"
          width={80}
          height={80}
          style={{ objectFit: "contain", display: "block" }}
          priority
        />
      </div>
    </div>
  );
}
