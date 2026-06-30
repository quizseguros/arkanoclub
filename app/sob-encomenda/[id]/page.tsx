import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productsSobEncomenda } from "@/data/products-sob-encomenda";
import { SITE_URL } from "@/lib/config";
import ProductDetail from "@/components/ProductDetail";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return productsSobEncomenda.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = productsSobEncomenda.find((p) => p.id === id);
  if (!product) return {};

  const title = `${product.name} | Arkano Club`;
  const imageUrl = `${SITE_URL}${product.image}`;

  return {
    title,
    description: product.description,
    openGraph: {
      title,
      description: product.description,
      url: `${SITE_URL}/sob-encomenda/${product.id}`,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.description,
      images: [imageUrl],
    },
    other: { "product:brand": product.brand },
  };
}

export default async function SobEncomendaProdutoPage({ params }: Props) {
  const { id } = await params;
  const product = productsSobEncomenda.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <ProductDetail
      data={{
        name: product.name,
        brandName: product.brand,
        category: product.category,
        price: product.price,
        caseDiameter: product.caseDiameter,
        movement: product.movement,
        image: product.image,
        description: product.description,
        stockLabel: "Sob encomenda",
        conditionLabel: product.condition === "seminovo" ? "Seminovo" : undefined,
        backHref: "/#sob-encomenda",
        backLabel: "Voltar pra Sob Encomenda",
      }}
    />
  );
}
