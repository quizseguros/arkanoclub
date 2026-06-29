import Image from "next/image";
import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import { INSTAGRAM_URL, whatsappLink } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-arkano-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Image src="/img/identidade/logo-branco.png" alt="Arkano Club" width={56} height={56} />
          <p className="mt-4 max-w-xs text-sm text-arkano-champagne/60">
            Relógios originais, com garantia, para todo o Brasil.
          </p>
          <p className="mt-3 text-xs uppercase tracking-widest2 text-arkano-gold">
            Tempo · Estilo · Legado
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-medium tracking-wide text-arkano-champagne">Navegação</h4>
          <ul className="space-y-2 text-sm text-arkano-champagne/60">
            <li><Link href="/#catalogo" className="hover:text-arkano-gold">Catálogo</Link></li>
            <li><Link href="/#femininos" className="hover:text-arkano-gold">Femininos</Link></li>
            <li><Link href="/quem-somos" className="hover:text-arkano-gold">Quem somos</Link></li>
            <li><Link href="/vender-relogio" className="hover:text-arkano-gold">Vender seu relógio</Link></li>
            <li><Link href="/grupo-vip" className="hover:text-arkano-gold">Grupo VIP</Link></li>
            <li><Link href="/founders" className="hover:text-arkano-gold">Arkano Founders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-medium tracking-wide text-arkano-champagne">Contato</h4>
          <ul className="space-y-2 text-sm text-arkano-champagne/60">
            <li>
              <a
                href={whatsappLink("Olá! Vim pelo site do Arkano Club.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-arkano-gold"
              >
                <MessageCircle size={15} />
                WhatsApp
              </a>
            </li>
            <li>
              <Link href="/grupo-vip" className="flex items-center gap-2 hover:text-arkano-gold">
                <MessageCircle size={15} />
                Grupo VIP de ofertas
              </Link>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-arkano-gold"
              >
                <Instagram size={15} />
                @arkano.club
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-medium tracking-wide text-arkano-champagne">Garantia</h4>
          <div className="flex items-center gap-3">
            <Image
              src="/img/identidade/selo-autenticacao.png"
              alt="Selo de Autenticação Arkano Club, produto 100% original"
              width={64}
              height={64}
            />
            <p className="text-sm text-arkano-champagne/60">
              100% original. Toda peça vendida pelo Arkano Club tem garantia e autenticidade confirmada.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-arkano-champagne/40 sm:px-6">
        © {new Date().getFullYear()} Arkano Club, Comércio e Serviços. CNPJ 56.027.265/0001-38.
      </div>
    </footer>
  );
}
