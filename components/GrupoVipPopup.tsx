"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { WHATSAPP_GRUPO_VIP } from "@/lib/config";

export default function GrupoVipPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("arkano-popup-dismissed")) return;

    let timer: ReturnType<typeof setTimeout>;

    function onScroll() {
      if (window.scrollY > 80) {
        timer = setTimeout(() => setVisible(true), 2000);
        window.removeEventListener("scroll", onScroll);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  function close() {
    sessionStorage.setItem("arkano-popup-dismissed", "1");
    setDismissed(true);
  }

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={close}
    >
      <div
        className="relative max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Fechar"
          className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-arkano-black border border-white/20 text-arkano-champagne/70 hover:text-white transition-colors shadow-lg"
        >
          <X size={16} />
        </button>

        <a
          href={WHATSAPP_GRUPO_VIP}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
        >
          <Image
            src="/img/pop-up-grupovip.png"
            alt="Grupo VIP Arkano Club — ofertas exclusivas no WhatsApp"
            width={480}
            height={480}
            className="w-full rounded-xl shadow-2xl"
            priority
          />
        </a>
      </div>
    </div>
  );
}
