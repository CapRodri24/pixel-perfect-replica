/**
 * Paraba barba azul (Ara glaucogularis), ave emblema de Armonía, que llega volando,
 * se posa sobre el botón "Donar", mira alrededor, parpadea, salta y se vuelve a ir.
 * Un ciclo dura 14 s. Con "reducir movimiento" activado queda posada y quieta.
 */
const CICLO = "14s";

const estilos = `
.dp-svg { overflow: visible; }
.dp-flight { opacity: 0; }
.dp-folded, .dp-feet { opacity: 1; }
.dp-heart { opacity: 0; }

@media (prefers-reduced-motion: no-preference) {
  .dp-path   { animation: dp-path ${CICLO} cubic-bezier(.45,.05,.35,1) infinite; transform-origin: 62px 100px; }
  .dp-body   { animation: dp-body ${CICLO} ease-in-out infinite; transform-origin: 62px 100px; }
  .dp-flight { animation: dp-flight-show ${CICLO} steps(1, end) infinite; }
  .dp-folded, .dp-feet { animation: dp-folded-show ${CICLO} steps(1, end) infinite; }
  .dp-flap   { animation: dp-flap .34s ease-in-out infinite; transform-origin: 58px 57px; }
  .dp-flap-far { animation-delay: -.06s; }
  .dp-ruffle { animation: dp-ruffle ${CICLO} ease-in-out infinite; transform-origin: 50px 50px; }
  .dp-tail   { animation: dp-tail ${CICLO} ease-in-out infinite; transform-origin: 54px 76px; }
  .dp-head   { animation: dp-head ${CICLO} ease-in-out infinite; transform-origin: 76px 44px; }
  .dp-blink  { animation: dp-blink ${CICLO} linear infinite; transform-origin: 87px 30px; }
  .dp-heart  { animation: dp-heart ${CICLO} ease-out infinite; }
  .dp-heart:nth-child(2) { animation-delay: .35s; }
  .dp-heart:nth-child(3) { animation-delay: .7s; }
}

/* Trayectoria: entra volando desde la izquierda, se posa y sale hacia arriba a la derecha. */
@keyframes dp-path {
  0%   { transform: translate(-280px,-160px) rotate(-6deg); opacity: 0; }
  3%   { opacity: 1; }
  9%   { transform: translate(-140px,-110px) rotate(-4deg); }
  14%  { transform: translate(-34px,-36px) rotate(6deg); }
  17%  { transform: translate(0,0) rotate(0); }
  78%  { transform: translate(0,0) rotate(0); opacity: 1; }
  82%  { transform: translate(10px,-18px) rotate(-8deg); }
  90%  { transform: translate(120px,-120px) rotate(-12deg); }
  97%  { transform: translate(240px,-230px) rotate(-14deg); opacity: 1; }
  98%, 100% { transform: translate(240px,-230px) rotate(-14deg); opacity: 0; }
}
/* Alas abiertas solo mientras vuela; plegadas mientras está posada. */
@keyframes dp-flight-show { 0% { opacity: 1; } 17% { opacity: 0; } 80% { opacity: 1; } }
@keyframes dp-folded-show { 0% { opacity: 0; } 17% { opacity: 1; } 80% { opacity: 0; } }
@keyframes dp-flap {
  0%, 100% { transform: rotate(-32deg); }
  50%      { transform: rotate(42deg) scaleY(.72); }
}
/* Aterrizaje con amortiguación, saltito y agachada antes de despegar. */
@keyframes dp-body {
  0%, 16.5% { transform: none; }
  18%   { transform: translateY(2px) scaleY(.9); }
  20%   { transform: none; }
  59%   { transform: translateY(1px) scaleY(.95); }
  61%   { transform: translateY(-8px); }
  63%   { transform: none; }
  77%   { transform: none; }
  79.5% { transform: translateY(2px) scaleY(.88); }
  80.5%, 100% { transform: none; }
}
@keyframes dp-head {
  0%, 24%   { transform: none; }
  27%, 33%  { transform: rotate(-16deg); }
  37%, 43%  { transform: rotate(12deg); }
  46%       { transform: none; }
  66%       { transform: none; }
  68%       { transform: rotate(22deg) translateY(2px); }
  70%, 100% { transform: none; }
}
@keyframes dp-blink {
  0%, 38%, 39.6%, 52%, 53.6%, 100% { transform: scaleY(0); }
  38.8%, 52.8% { transform: scaleY(1); }
}
@keyframes dp-ruffle {
  0%, 47% { transform: none; }
  49%     { transform: rotate(-12deg); }
  51%     { transform: rotate(4deg); }
  53%, 100% { transform: none; }
}
@keyframes dp-tail {
  0%, 55% { transform: none; }
  56.5%   { transform: rotate(7deg); }
  58%     { transform: rotate(-5deg); }
  59.5%, 100% { transform: none; }
}
/* Corazones que suben del botón cuando el ave aterriza. */
@keyframes dp-heart {
  0%, 17.5% { opacity: 0; transform: translateY(6px) scale(.5); }
  19%       { opacity: 1; transform: translateY(0) scale(.85); }
  30%       { opacity: 0; transform: translateY(-46px) scale(1.1); }
  100%      { opacity: 0; }
}
`;

function AlaAbierta({ lejana = false }: { lejana?: boolean }) {
  return (
    <g className="dp-flight" transform={lejana ? "translate(5 -3)" : undefined}>
      <g className={`dp-flap ${lejana ? "dp-flap-far" : ""}`}>
        <path
          d="M58 56 C50 36 34 20 10 16 C18 24 22 28 24 33 C16 33 10 37 6 43 C13 43 19 45 23 47 C18 50 14 54 12 58 C30 61 46 62 60 62 Z"
          fill={lejana ? "#0c3a7a" : "url(#dp-wing)"}
        />
        {!lejana && (
          <g fill="none" stroke="#0b3d91" strokeWidth="1" strokeLinecap="round" opacity=".7">
            <path d="M52 50 C40 40 28 32 14 24" />
            <path d="M50 55 C38 50 26 46 12 44" />
            <path d="M50 59 C38 58 26 58 16 57" />
          </g>
        )}
      </g>
    </g>
  );
}

export function DonationParrot() {
  return (
    <>
      <style>{estilos}</style>
      <svg
        viewBox="0 0 120 110"
        aria-hidden="true"
        className="dp-svg pointer-events-none absolute bottom-[calc(100%-7px)] right-3 h-[66px] w-[72px] drop-shadow-[0_6px_8px_rgba(0,0,0,.25)] md:right-5 md:h-[88px] md:w-[96px]"
      >
        <defs>
          <linearGradient id="dp-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#38b6e8" />
            <stop offset="1" stopColor="#1565c0" />
          </linearGradient>
          <linearGradient id="dp-belly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd84d" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="dp-wing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2196f3" />
            <stop offset="1" stopColor="#0d47a1" />
          </linearGradient>
          <linearGradient id="dp-tail" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1e88e5" />
            <stop offset="1" stopColor="#0a347f" />
          </linearGradient>
        </defs>

        <g className="dp-path">
          <g className="dp-body">
            <AlaAbierta lejana />

            {/* Cola larga */}
            <g className="dp-tail">
              <path d="M50 70 C40 84 28 98 12 108 C30 105 45 96 58 80 Z" fill="url(#dp-tail)" />
              <path d="M55 74 C47 88 37 100 26 108 C39 104 51 94 61 80 Z" fill="#1e88e5" />
            </g>

            {/* Cuerpo: dorso azul y pecho amarillo dorado */}
            <path d="M46 52 C50 38 66 32 78 40 C88 48 88 70 78 84 C70 94 56 94 50 86 C44 78 42 64 46 52 Z" fill="url(#dp-back)" />
            <path d="M75 43 C88 52 88 72 78 84 C72 92 62 93 56 89 C70 82 79 66 75 43 Z" fill="url(#dp-belly)" />

            {/* Ala plegada */}
            <g className="dp-folded">
              <g className="dp-ruffle">
                <path d="M48 50 C58 46 68 50 70 60 C72 72 64 84 54 92 L43 101 C41 88 40 72 44 60 C45 55 46 52 48 50 Z" fill="url(#dp-wing)" />
                <g fill="none" stroke="#0b3d91" strokeWidth="1" strokeLinecap="round" opacity=".75">
                  <path d="M50 62 C56 70 58 80 52 92" />
                  <path d="M56 57 C62 66 64 76 60 86" />
                  <path d="M62 55 C66 62 67 70 65 78" />
                </g>
              </g>
            </g>

            <AlaAbierta />

            {/* Cabeza */}
            <g className="dp-head">
              <circle cx="80" cy="34" r="15" fill="#2aa7e0" />
              {/* Cara clara con líneas finas */}
              <path d="M82 25 C90 23 96 29 95 37 C92 42 86 42 82 38 C80 34 80 29 82 25 Z" fill="#eef3f6" />
              <g stroke="#5f7f9f" strokeWidth=".8" strokeLinecap="round">
                <path d="M84 33 L91 33" />
                <path d="M84 36 L90 36.5" />
              </g>
              {/* Ojo con iris amarillo */}
              <circle cx="87" cy="30" r="2.6" fill="#f5c518" />
              <circle cx="87.3" cy="30" r="1.5" fill="#111" />
              <circle cx="87.9" cy="29.3" r=".55" fill="#fff" />
              <ellipse className="dp-blink" cx="87" cy="30" rx="3.1" ry="3.1" fill="#eef3f6" />
              {/* "Barba" azul bajo el pico */}
              <path d="M80 42 C84 49 92 50 96 44 C92 46 86 45 82 40 Z" fill="#1d4ed8" />
              {/* Pico negro curvo */}
              <path d="M93 27 C101 25 108 31 106 42 C104 46 101 47 99 46 C101 41 99 36 94 36 Z" fill="#1a1a1a" />
              <path d="M94 36 C99 37 101 41 99 46 C96 46 93 42 94 36 Z" fill="#3a3a3a" />
              <path d="M96 28.5 C100 28.5 103 31 104 34" fill="none" stroke="#4b4b4b" strokeWidth=".8" strokeLinecap="round" />
            </g>

            {/* Patas aferradas al botón */}
            <g className="dp-feet" stroke="#6b7280" strokeWidth="2.6" strokeLinecap="round" fill="none">
              <path d="M60 89 L60 98" />
              <path d="M69 88 L69 98" />
              <path d="M55 99 L64 99" />
              <path d="M64 99 L73 99" />
            </g>
          </g>
        </g>
      </svg>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-full right-11 flex gap-1 text-rose-500 md:right-14">
        {[0, 1, 2].map((i) => (
          <svg key={i} viewBox="0 0 24 24" className="dp-heart size-3.5 md:size-4" fill="currentColor">
            <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3.1 4.5 6.9 4.5c2.1 0 3.6 1.1 4.6 2.6 1-1.5 2.5-2.6 4.6-2.6 3.8 0 6 3.9 4.5 7.3C19.5 16.4 12 21 12 21z" />
          </svg>
        ))}
      </span>
    </>
  );
}
