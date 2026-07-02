"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Loader2, MessageCircle, X } from "lucide-react";
import { whatsappLink } from "@/lib/config";

const BUDGETS = [
  "Até R$ 1.000",
  "R$ 1.000 a R$ 3.000",
  "R$ 3.000 a R$ 6.000",
  "Acima de R$ 6.000",
  "Prefiro não informar",
];

export default function EncomendaPage() {
  const [name, setName]     = useState("");
  const [phone, setPhone]   = useState("");
  const [brand, setBrand]   = useState("");
  const [model, setModel]   = useState("");
  const [budget, setBudget] = useState("");
  const [note, setNote]     = useState("");
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading]       = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImage(file: File) {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImage(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleImage(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    // Se tiver imagem, faz upload e pega o link pra incluir na mensagem
    let imageUrl: string | null = null;
    if (imageFile) {
      try {
        const fd = new FormData();
        fd.append("image", imageFile);
        const res = await fetch("/api/upload-image", { method: "POST", body: fd });
        const json = await res.json();
        imageUrl = json.url ?? null;
      } catch {
        // Upload falhou — envia sem imagem
      }
    }

    const lines = [
      "🕐 *Pedido de Encomenda — Arkano Club*",
      "",
      `*Nome:* ${name}`,
      `*WhatsApp:* ${phone}`,
      `*Marca:* ${brand}`,
      `*Modelo / referência:* ${model}`,
      budget   ? `*Orçamento:* ${budget}` : null,
      note     ? `*Observações:* ${note}` : null,
      imageUrl ? `\n*Foto de referência:* ${imageUrl}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    setUploading(false);
    window.open(whatsappLink(lines), "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "rounded-lg border border-white/10 bg-arkano-graphite px-4 py-3 text-sm text-arkano-champagne placeholder:text-arkano-champagne/40 focus:border-arkano-gold focus:outline-none w-full";

  return (
    <main className="min-h-screen bg-arkano-black px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-xl">
        <Link
          href="/#sob-encomenda"
          className="mb-8 inline-flex items-center gap-2 text-sm text-arkano-champagne/60 transition hover:text-arkano-gold"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>

        <p className="text-xs uppercase tracking-widest text-arkano-gold/70">Sob Encomenda</p>
        <h1 className="mt-1 text-2xl font-light text-arkano-champagne sm:text-3xl">
          Encontre o relógio que você procura
        </h1>
        <p className="mt-2 text-sm text-arkano-champagne/50">
          Não achou no catálogo? Manda a referência e a gente busca pra você — com preço e prazo confirmados.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome *"
              className={inputClass}
            />
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Seu WhatsApp *"
              type="tel"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Marca desejada *"
              className={inputClass}
            />
            <input
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Modelo ou referência *"
              className={inputClass}
            />
          </div>

          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Orçamento estimado (opcional)</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Alguma observação? Cor, tamanho, versão específica..."
            rows={3}
            className={`${inputClass} resize-none`}
          />

          {/* Foto de referência */}
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-arkano-champagne/50">
              Foto de referência{" "}
              <span className="normal-case text-arkano-champagne/30">(opcional)</span>
            </p>

            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl border border-arkano-gold/30">
                <img
                  src={imagePreview}
                  alt="Referência"
                  className="h-48 w-full object-contain bg-arkano-graphite"
                />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute right-3 top-3 rounded-full bg-black/70 p-1.5 text-white/80 transition hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-white/20 bg-arkano-graphite/50 px-6 py-8 text-center transition hover:border-arkano-gold/40 hover:bg-arkano-graphite"
              >
                <Camera size={28} className="text-arkano-gold/60" />
                <p className="text-sm text-arkano-champagne/50">
                  Clique ou arraste a foto do modelo
                </p>
                <p className="text-xs text-arkano-champagne/30">JPG, PNG ou WebP</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-arkano-gold py-3.5 text-sm font-medium text-arkano-black transition hover:bg-arkano-gold-light disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Enviando foto...
              </>
            ) : (
              <>
                <MessageCircle size={16} />
                Enviar pedido pelo WhatsApp
              </>
            )}
          </button>

          <p className="text-center text-xs text-arkano-champagne/30">
            Sua mensagem vai direta pro WhatsApp do Guilherme. Sem cadastro, sem senha.
          </p>
        </form>
      </div>
    </main>
  );
}
