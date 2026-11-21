
export const resourceTypes = [
  {
    id: "informes",
    es: "Informes y memorias",
    en: "Reports & annual reviews",
  },
  {
    id: "publicaciones",
    es: "Publicaciones científicas y técnicas",
    en: "Scientific & technical publications",
  },
  {
    id: "sig",
    es: "Recursos SIG / mapas",
    en: "GIS resources / maps",
  },
  {
    id: "colaboraciones",
    es: "Colaboraciones",
    en: "Collaborations",
  },
  {
    id: "legales",
    es: "Herramientas legales",
    en: "Legal tools",
  },
] as const;

export type ResourceType =
  (typeof resourceTypes)[number]["id"];

export type Resource = {
  id: string;
  type: ResourceType;
  title: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  year: number;
  format: string;
  url: string | null;
};

export const resources: Resource[] = [
  {
    id: "r1",
    type: "informes",
    title: {
      es: "Memoria institucional",
      en: "Annual review",
    },
    description: {
      es: "Ejemplo de memoria de actividades, resultados y avances institucionales.",
      en: "Sample annual review of activities, results and institutional progress.",
    },
    year: 2025,
    format: "PDF",
    url: null,
  },
  {
    id: "r2",
    type: "informes",
    title: {
      es: "Informe de impacto",
      en: "Impact report",
    },
    description: {
      es: "Ejemplo de sistematización de acciones de conservación y trabajo comunitario.",
      en: "Sample overview of conservation and community work.",
    },
    year: 2026,
    format: "PDF",
    url: null,
  },
  {
    id: "r3",
    type: "publicaciones",
    title: {
      es: "Monitoreo de aves amenazadas",
      en: "Monitoring threatened birds",
    },
    description: {
      es: "Ficha de ejemplo de una publicación técnica sobre métodos de seguimiento de aves.",
      en: "Sample technical publication on bird monitoring methods.",
    },
    year: 2025,
    format: "PDF",
    url: null,
  },
  {
    id: "r4",
    type: "sig",
    title: {
      es: "Mapa de paisajes de Bolivia",
      en: "Map of Bolivia’s landscapes",
    },
    description: {
      es: "Ejemplo de recurso cartográfico para identificar paisajes de conservación.",
      en: "Sample mapping resource for identifying conservation landscapes.",
    },
    year: 2026,
    format: "GeoJSON",
    url: null,
  },
  {
    id: "r5",
    type: "colaboraciones",
    title: {
      es: "Investigación y cooperación",
      en: "Research and cooperation",
    },
    description: {
      es: "Ejemplo de documentación de iniciativas de colaboración académica e institucional.",
      en: "Sample documentation of academic and institutional collaboration.",
    },
    year: 2025,
    format: "PDF",
    url: null,
  },
  {
    id: "r6",
    type: "legales",
    title: {
      es: "Compendio de herramientas de conservación",
      en: "Conservation toolkit",
    },
    description: {
      es: "Ficha de demostración de documentos normativos y herramientas de gestión.",
      en: "Sample entry for regulatory documents and management tools.",
    },
    year: 2026,
    format: "PDF",
    url: null,
  },
];
