import { percentualDesconto, precoPromocional } from "@/lib/promo";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Preço do relógio, no card e na página de detalhes.
 *
 *  Fora de campanha mostra só o preço cheio, exatamente como era antes. Com a
 *  campanha no ar e preço promocional cadastrado no painel, risca o cheio e
 *  destaca o promocional. O `promoAtiva` vem de fora — quem sabe se a campanha
 *  está valendo é o componente cliente que renderiza a lista, porque essa conta
 *  precisa acontecer no navegador (o site é export estático).
 *
 *  O parcelamento é independente da campanha: aparece com ou sem promoção,
 *  sempre que estiver cadastrado. */
export default function ProductPrice({
  price,
  promoPrice,
  installments,
  installmentPrice,
  promoAtiva,
  size = "sm",
}: {
  price: number;
  promoPrice?: number;
  installments?: number;
  installmentPrice?: number;
  promoAtiva?: boolean;
  size?: "sm" | "lg";
}) {
  const promo = promoAtiva ? precoPromocional({ price, promoPrice }) : null;
  const grande = size === "lg";

  const parcelamento =
    installments && installmentPrice && installments > 0 && installmentPrice > 0 ? (
      <span
        className={`text-arkano-champagne/50 ${grande ? "text-sm" : "text-[11px] sm:text-xs"}`}
      >
        em até{" "}
        <strong className="font-medium text-arkano-champagne/75">
          {installments}x de {currency.format(installmentPrice)}
        </strong>
      </span>
    ) : null;

  if (promo === null) {
    return (
      <div className="flex flex-col gap-0.5">
        <span
          className={
            grande
              ? "text-3xl font-light text-arkano-champagne"
              : "text-base font-light text-arkano-champagne sm:text-lg"
          }
        >
          {currency.format(price)}
        </span>
        {parcelamento}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`font-light text-arkano-champagne/40 line-through ${
            grande ? "text-base" : "text-xs sm:text-sm"
          }`}
        >
          {currency.format(price)}
        </span>
        <span
          className={`rounded-full bg-arkano-blue/20 font-medium uppercase tracking-wider text-arkano-blue-light ring-1 ring-arkano-blue-light/40 ${
            grande ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]"
          }`}
        >
          {percentualDesconto(price, promo)}% off
        </span>
      </div>

      <span
        className={`promo-price-shine font-bold tracking-tight ${
          grande ? "text-4xl" : "text-xl sm:text-2xl"
        }`}
      >
        {currency.format(promo)}
      </span>

      {parcelamento}

      {/* só na página de detalhes: no card o selo azul da foto já diz isso, e
          no celular essa linha ainda quebrava em duas */}
      {grande && (
        <span className="text-[11px] uppercase tracking-widest2 text-arkano-blue-light/70">
          Preço de Dia dos Pais
        </span>
      )}
    </div>
  );
}
