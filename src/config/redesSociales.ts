/** Enlaces oficiales de las redes sociales de Armonía. Cualquier vista que muestre redes debe usar esta lista. */
export const REDES_SOCIALES = {
  instagram: { nombre: "Instagram", url: "https://www.instagram.com/armonia.bolivia/?hl=es" },
  facebook: { nombre: "Facebook", url: "https://www.facebook.com/armoniabolivia" },
  x: { nombre: "X", url: "https://x.com/ArmoniaBolivia" },
  youtube: { nombre: "YouTube", url: "https://www.youtube.com/channel/UCIIFPr0yTWSeuJ3NPNz-8MQ" },
} as const;

export type RedSocial = keyof typeof REDES_SOCIALES;
