"use client";

import { useEffect, useState } from "react";

// Arc lengths (degrees × 2π × r / 360): r=88
// Right arc: 110° → 169px  |  Bottom: 76° → 117px  |  Left: 110° → 169px
const ARC1 = 169;
const ARC2 = 117;
const ARC3 = 169;

export default function SplashScreen() {
  const [aOpacity, setAOpacity]     = useState(0);
  const [arc1, setArc1]             = useState(0); // 0=hidden 1=fully drawn
  const [arc2, setArc2]             = useState(0);
  const [arc3, setArc3]             = useState(0);
  const [logoScale, setLogoScale]   = useState(1);
  const [logoBlur, setLogoBlur]     = useState(0);
  const [bgOpacity, setBgOpacity]   = useState(1);
  const [done, setDone]             = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    t(() => setAOpacity(1),          200);  // A aparece
    t(() => setArc1(1),              750);  // Arco direito começa
    t(() => setArc2(1),              1250); // Arco inferior
    t(() => setArc3(1),              1650); // Arco esquerdo
    // Arco esquerdo termina ~1650+700 = 2350ms
    t(() => { setLogoScale(14); setLogoBlur(14); }, 2750); // Zoom + blur
    t(() => setBgOpacity(0),         2850); // Fundo some
    t(() => { document.body.style.overflow = ""; setDone(true); }, 3900);

    return () => { timers.forEach(clearTimeout); document.body.style.overflow = ""; };
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
        opacity: bgOpacity,
        transition: bgOpacity === 0 ? "opacity 1.05s ease" : "none",
        pointerEvents: bgOpacity === 0 ? "none" : "auto",
      }}
    >
      <div
        style={{
          transform: `scale(${logoScale})`,
          filter: `blur(${logoBlur}px)`,
          transition: logoScale > 1
            ? "transform 0.85s cubic-bezier(0.4,0,1,1), filter 0.85s ease"
            : "none",
          willChange: "transform, filter",
        }}
      >
        <svg
          viewBox="0 0 200 200"
          width="128"
          height="128"
          style={{ display: "block", overflow: "visible" }}
        >
          {/* ── Letra A ── */}
          {/*  Outer shape + counter (evenodd cria o triângulo vazado e a barra) */}
          <path
            fillRule="evenodd"
            fill="#c9a24b"
            d="M100 16 L186 188 L152 188 L128 118 L72 118 L48 188 L14 188 Z
               M100 50 L121 110 L79 110 Z"
            style={{ opacity: aOpacity, transition: "opacity 0.6s ease" }}
          />

          {/* ── Arco Direito: de cima-direita → baixo-direita (horário, 110°) ── */}
          {/* Ângulos CLOCK: 20° → 130°  |  SVG start (130.1, 17.3) end (167.4, 156.6) */}
          <path
            fill="none"
            stroke="#c9a24b"
            strokeWidth="10"
            strokeLinecap="round"
            d="M 130.1 17.3 A 88 88 0 0 1 167.4 156.6"
            strokeDasharray={ARC1}
            strokeDashoffset={ARC1 * (1 - arc1)}
            style={{ transition: "stroke-dashoffset 0.7s ease" }}
          />

          {/* ── Arco Inferior: baixo-direita → baixo-esquerda (horário, 76°) ── */}
          {/* CLOCK: 142° → 218°  |  SVG start (154.2, 169.3) end (45.8, 169.3) */}
          <path
            fill="none"
            stroke="#c9a24b"
            strokeWidth="10"
            strokeLinecap="round"
            d="M 154.2 169.3 A 88 88 0 0 1 45.8 169.3"
            strokeDasharray={ARC2}
            strokeDashoffset={ARC2 * (1 - arc2)}
            style={{ transition: "stroke-dashoffset 0.55s ease" }}
          />

          {/* ── Arco Esquerdo: baixo-esquerda → cima-esquerda (horário, 110°) ── */}
          {/* CLOCK: 230° → 340°  |  SVG start (32.6, 156.6) end (69.9, 17.3) */}
          <path
            fill="none"
            stroke="#c9a24b"
            strokeWidth="10"
            strokeLinecap="round"
            d="M 32.6 156.6 A 88 88 0 0 1 69.9 17.3"
            strokeDasharray={ARC3}
            strokeDashoffset={ARC3 * (1 - arc3)}
            style={{ transition: "stroke-dashoffset 0.7s ease" }}
          />
        </svg>
      </div>
    </div>
  );
}
