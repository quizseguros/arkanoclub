import Image from "next/image";
import LightRays from "./LightRays";

export default function FoundersLocked() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-6">
      <LightRays
        raysOrigin="top-center"
        raysColor="#c9a24b"
        raysSpeed={1}
        lightSpread={0.9}
        rayLength={1.6}
        pulsating
        followMouse
        mouseInfluence={0.15}
        noiseAmount={0.04}
        distortion={0.05}
        className="opacity-60"
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "url('/img/identidade/padrao-quadradinhos.png')",
          backgroundSize: "320px",
        }}
      />

      <div className="relative flex flex-col items-center gap-6">
        <div className="relative flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
          <svg viewBox="0 0 200 200" className="founders-orbit absolute inset-0 h-full w-full">
            <defs>
              <path id="founders-orbit-path" d="M 100,100 m -82,0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0" />
            </defs>
            <text fill="#c9a24b" fontSize="11" letterSpacing="3" className="uppercase">
              <textPath href="#founders-orbit-path">
                Área bloqueada &#8226; Área bloqueada &#8226; Área bloqueada &#8226;
              </textPath>
            </text>
          </svg>

          <div className="founders-lock-float relative h-24 w-24 sm:h-28 sm:w-28">
            <Image
              src="/img/founders/cadeado-arkano.png"
              alt="Área bloqueada"
              fill
              priority
              sizes="112px"
              className="object-contain drop-shadow-[0_0_30px_rgba(201,162,75,0.45)]"
            />
          </div>
        </div>

        <h1 className="max-w-2xl text-3xl font-light text-arkano-champagne sm:text-4xl">
          Arkano Founders
        </h1>
        <p className="max-w-xl text-sm text-arkano-champagne/70 sm:text-base">
          Algo grandioso está chegando. Uma área exclusiva pra quem realmente faz parte da
          família Arkano Club. Clientes fiéis e quem confia na marca desde sempre vão ser os
          primeiros a entrar.
        </p>

        <span className="mt-2 rounded-full border border-arkano-gold px-7 py-2.5 text-sm font-medium text-arkano-gold">
          Em breve
        </span>
      </div>
    </section>
  );
}
