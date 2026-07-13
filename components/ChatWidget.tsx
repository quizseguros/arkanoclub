"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MessageCircle, Send, X } from "lucide-react";
import { whatsappLink, WHATSAPP_GRUPO_VIP } from "@/lib/config";
import { searchProducts } from "@/lib/product-search";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

type QuickAction = { label: string; onClick: () => void };
type ChatMessage = { id: number; from: "bot" | "user"; text: string; actions?: QuickAction[] };

let nextId = 1;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      pushBot(
        "Oi! 👋 Sou o assistente do Arkano Club. Posso te ajudar a encontrar um relógio, explicar o Grupo VIP, o Arkano Founders, ou te colocar direto em contato com o Guilherme. O que você precisa?",
        mainMenu()
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function pushUser(text: string) {
    setMessages((m) => [...m, { id: nextId++, from: "user", text }]);
  }

  function pushBot(text: string, actions?: QuickAction[]) {
    setMessages((m) => [...m, { id: nextId++, from: "bot", text, actions }]);
  }

  function backToMenu() {
    setSearchMode(false);
    pushBot("Em que mais posso ajudar?", mainMenu());
  }

  function goToSection(sectionId: string, label: string) {
    pushUser(label);
    setOpen(false);
    if (pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${sectionId}`);
    }
  }

  function goToPage(href: string, label: string) {
    pushUser(label);
    setOpen(false);
    router.push(href);
  }

  function mainMenu(): QuickAction[] {
    return [
      { label: "Ver relógios em estoque", onClick: () => goToSection("catalogo", "Ver relógios em estoque") },
      {
        label: "Buscar um modelo",
        onClick: () => {
          pushUser("Buscar um modelo");
          setSearchMode(true);
          pushBot("Digita o nome do relógio ou da marca que você procura:");
        },
      },
      { label: "Grupo VIP / comunidade", onClick: answerGrupoVip },
      { label: "O que é Arkano Founders?", onClick: answerFounders },
      { label: "Vender meu relógio", onClick: () => goToPage("/vender-relogio", "Vender meu relógio") },
      { label: "Falar com o Guilherme", onClick: answerWhatsapp },
    ];
  }

  function answerGrupoVip() {
    pushUser("Grupo VIP / comunidade");
    pushBot(
      "O Grupo VIP é a comunidade do Arkano Club no WhatsApp: ofertas exclusivas, lançamentos em primeira mão e conteúdo sobre relojoaria. É só entrar pelo botão abaixo.",
      [
        { label: "Entrar no Grupo VIP", onClick: () => window.open(WHATSAPP_GRUPO_VIP, "_blank", "noopener,noreferrer") },
        { label: "Voltar ao menu", onClick: backToMenu },
      ]
    );
  }

  function answerFounders() {
    pushUser("O que é Arkano Founders?");
    pushBot(
      "Arkano Founders é uma área exclusiva, em breve, pra quem já faz parte da família Arkano Club há mais tempo — os clientes mais fiéis vão ter acesso em primeira mão.",
      [
        { label: "Ver página do Arkano Founders", onClick: () => goToPage("/founders", "Ver página do Arkano Founders") },
        { label: "Voltar ao menu", onClick: backToMenu },
      ]
    );
  }

  function answerWhatsapp() {
    pushUser("Falar com o Guilherme");
    pushBot("Beleza, vou te levar direto pro WhatsApp do Guilherme.", [
      {
        label: "Abrir WhatsApp",
        onClick: () =>
          window.open(
            whatsappLink("Olá! Vim pelo site do Arkano Club e quero falar com você."),
            "_blank",
            "noopener,noreferrer"
          ),
      },
      { label: "Voltar ao menu", onClick: backToMenu },
    ]);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    pushUser(q);
    setQuery("");

    const results = searchProducts(q, 4);
    if (results.length > 0) {
      pushBot(
        `Achei ${results.length === 1 ? "esse relógio" : `esses ${results.length} relógios`}:`,
        results.map((r) => ({
          label: `${r.name} — ${currency.format(r.price)}`,
          onClick: () => {
            setOpen(false);
            router.push(r.href);
          },
        }))
      );
    } else {
      pushBot("Não encontrei nada com esse nome. Quer falar direto com o Guilherme?", [
        { label: "Falar com o Guilherme", onClick: answerWhatsapp },
        { label: "Voltar ao menu", onClick: backToMenu },
      ]);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar chat" : "Abrir chat"}
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-arkano-gold text-arkano-black shadow-lg transition hover:bg-arkano-gold-light sm:bottom-6 sm:right-6"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[90] flex h-[32rem] max-h-[70vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-arkano-graphite shadow-2xl sm:bottom-28 sm:right-6">
          <div className="flex items-center justify-between border-b border-white/10 bg-arkano-black px-4 py-3">
            <div>
              <p className="text-sm font-medium text-arkano-champagne">Atendimento Arkano Club</p>
              <p className="text-xs text-arkano-champagne/50">Assistente automático</p>
            </div>
            <button
              aria-label="Fechar chat"
              onClick={() => setOpen(false)}
              className="text-arkano-champagne/60 hover:text-arkano-gold"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col gap-2 ${msg.from === "user" ? "items-end" : "items-start"}`}>
                {msg.text && (
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "bg-arkano-gold text-arkano-black"
                        : "bg-arkano-black text-arkano-champagne/90"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
                {msg.actions && (
                  <div className="flex max-w-[90%] flex-wrap gap-2">
                    {msg.actions.map((action) => (
                      <button
                        key={action.label}
                        onClick={action.onClick}
                        className="rounded-full border border-arkano-gold/40 px-3 py-1.5 text-xs text-arkano-gold transition hover:bg-arkano-gold hover:text-arkano-black"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {searchMode && (
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 border-t border-white/10 px-3 py-3"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Seiko, Tudor, Carrera..."
                autoFocus
                className="w-full rounded-full border border-white/10 bg-arkano-black px-4 py-2 text-sm text-arkano-champagne placeholder:text-arkano-champagne/40 focus:border-arkano-gold/50 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="flex shrink-0 items-center justify-center rounded-full bg-arkano-gold p-2.5 text-arkano-black transition hover:bg-arkano-gold-light"
              >
                <Send size={15} />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
