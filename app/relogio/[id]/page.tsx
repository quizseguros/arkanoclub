import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { brands } from "@/data/brands";
import { SITE_URL } from "@/lib/config";
import ProductDetail from "@/components/ProductDetail";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return {};

  const brandName = brands.find((b) => b.slug === product.brand)?.name ?? product.brand;
  const title = `${product.name} | Arkano Club`;
  const imageUrl = `${SITE_URL}${product.image}`;

  return {
    title,
    description: product.description,
    openGraph: {
      title,
      description: product.description,
      url: `${SITE_URL}/relogio/${product.id}`,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.description,
      images: [imageUrl],
    },
    other: { "product:brand": brandName },
  };
}

export default async function RelogioPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const brandName = brands.find((b) => b.slug === product.brand)?.name ?? product.brand;

  return (
    <ProductDetail
      data={{
        name: product.name,
        brandName,
        category: product.category,
        price: product.price,
        caseDiameter: product.caseDiameter,
        movement: product.movement,
        image: product.image,
        description: product.description,
        stockLabel: product.stock === "em-estoque" ? "Em estoque" : "Sob encomenda",
        backHref: "/#catalogo",
        backLabel: "Voltar pro catálogo",
      }}
    />
  );
}
