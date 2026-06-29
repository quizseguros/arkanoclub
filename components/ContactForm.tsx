"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/config";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = `Olá! Meu nome é ${name} (contato: ${phone}).\n\n${message}`;
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contato" className="border-b border-white/10 bg-arkano-black px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-light text-arkano-champagne">Fale com a gente</h2>
        <p className="mt-2 text-sm text-arkano-champagne/60">
          Manda sua mensagem. Ela é enviada direto pro nosso WhatsApp.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 text-left">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="rounded-lg border border-white/10 bg-arkano-graphite px-4 py-3 text-sm text-arkano-champagne placeholder:text-arkano-champagne/40 focus:border-arkano-gold focus:outline-none"
          />
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Seu telefone ou e-mail"
            className="rounded-lg border border-white/10 bg-arkano-graphite px-4 py-3 text-sm text-arkano-champagne placeholder:text-arkano-champagne/40 focus:border-arkano-gold focus:outline-none"
          />
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Sua mensagem"
            rows={4}
            className="resize-none rounded-lg border border-white/10 bg-arkano-graphite px-4 py-3 text-sm text-arkano-champagne placeholder:text-arkano-champagne/40 focus:border-arkano-gold focus:outline-none"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-full bg-arkano-gold py-3 text-sm font-medium text-arkano-black transition hover:bg-arkano-gold-light"
          >
            <MessageCircle size={16} />
            Enviar pelo WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
