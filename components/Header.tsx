"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { whatsappLink } from "@/lib/config";
import SearchAutocomplete from "./SearchAutocomplete";

const navLinks = [
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/#sob-encomenda", label: "Sob Encomenda" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/vender-relogio", label: "Vender seu relógio" },
  { href: "/grupo-vip", label: "Grupo VIP" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-arkano-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 sm:py-6">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Image src="/img/identidade/simbolo-branco.png" alt="Arkano Club" width={40} height={40} />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-arkano-champagne/80 transition hover:text-arkano-gold"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/founders" className="founders-glow flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide text-arkano-black">
            <Image src="/img/identidade/simbolo-preto.png" alt="" width={13} height={13} />
            Arkano Founders
          </Link>
        </nav>

        <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
          <SearchAutocomplete variant="desktop" />
          <a
            href={whatsappLink("Olá! Vim pelo site do Arkano Club e quero saber mais.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-arkano-gold px-5 py-2.5 text-sm font-medium text-arkano-black transition hover:bg-arkano-gold-light"
          >
            <MessageCircle size={16} />
            Falar no WhatsApp
          </a>
        </div>

        <button
          aria-label="Abrir menu"
          className="text-arkano-champagne lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 pb-6 pt-4 lg:hidden">
          <div className="mb-5">
            <SearchAutocomplete variant="mobile" onNavigate={() => setOpen(false)} />
          </div>

          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base text-arkano-champagne/80 hover:text-arkano-gold"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/founders"
              onClick={() => setOpen(false)}
              className="founders-glow flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-arkano-black"
            >
              <Image src="/img/identidade/simbolo-preto.png" alt="" width={15} height={15} />
              Arkano Founders
            </Link>
            <a
              href={whatsappLink("Olá! Vim pelo site do Arkano Club e quero saber mais.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center justify-center gap-2 rounded-full bg-arkano-gold px-5 py-2.5 text-center text-sm font-medium text-arkano-black"
            >
              <MessageCircle size={16} />
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
