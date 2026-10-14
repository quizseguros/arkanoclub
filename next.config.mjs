/** O site é publicado em dois lugares:
 *  - Vercel (arkanoclub.vercel.app): build normal, atualiza sozinho a cada push
 *  - Hostinger (arkanoclub.com): export estático, upload manual da pasta out/
 *
 *  Pra gerar a versão da Hostinger use o GERAR-SITE-REAL.bat (ou rode o build
 *  com EXPORT_ESTATICO=1). Sem essa variável o build sai no formato da Vercel —
 *  assim ninguém precisa editar este arquivo na mão e esquecer de desfazer.
 *
 *  @type {import('next').NextConfig} */
const exportEstatico = process.env.EXPORT_ESTATICO === "1";

const nextConfig = {
  ...(exportEstatico ? { output: "export", trailingSlash: true } : {}),
  // links de compartilhamento e prévia (WhatsApp, Instagram) apontam pro
  // domínio onde a versão está publicada
  env: {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL || (exportEstatico ? "https://arkanoclub.com" : "https://arkanoclub.vercel.app"),
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
