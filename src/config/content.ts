import { images } from "./images";

export type LandscapeId = "beni" | "yungas" | "andes" | "seco" | "amazonia";
export const landscapes: { id: LandscapeId; image: string }[] = [
  { id: "beni", image: images.landscapes.beni },
  { id: "yungas", image: images.landscapes.yungas },
  { id: "andes", image: images.landscapes.andes },
  { id: "seco", image: images.landscapes.seco },
  { id: "amazonia", image: images.landscapes.amazonia },
];

export type ProgramId = "barbaazul" | "palkachupa" | "tunari" | "frenteroja" | "tororoi" | "conservaaves" | "accionandina";
export const programs: { id: ProgramId; landscape: LandscapeId | null; image: string }[] = [
  { id: "barbaazul", landscape: "beni", image: images.landscapes.beni },
  { id: "palkachupa", landscape: "yungas", image: images.landscapes.yungas },
  { id: "tunari", landscape: "andes", image: images.landscapes.andes },
  { id: "frenteroja", landscape: "seco", image: images.landscapes.seco },
  { id: "tororoi", landscape: "amazonia", image: images.landscapes.amazonia },
  { id: "conservaaves", landscape: null, image: images.hero },
  { id: "accionandina", landscape: null, image: images.landscapes.andes },
];

export type NewsCategory = "institutional" | "stories" | "events" | "videos" | "infographics" | "gallery";
export const newsCategories: NewsCategory[] = ["institutional", "stories", "events", "videos", "infographics", "gallery"];
export const news: { id: string; category: NewsCategory; landscape: LandscapeId | null; program: ProgramId | null; date: string; image: string }[] = [
  { id: "n1", category: "stories", landscape: "beni", program: "barbaazul", date: "2026-10-28", image: images.landscapes.beni },
  { id: "n2", category: "stories", landscape: "yungas", program: "palkachupa", date: "2026-10-15", image: images.landscapes.yungas },
  { id: "n3", category: "events", landscape: "andes", program: "tunari", date: "2026-11-22", image: images.landscapes.andes },
  { id: "n4", category: "videos", landscape: "seco", program: "frenteroja", date: "2026-09-30", image: images.landscapes.seco },
  { id: "n5", category: "infographics", landscape: null, program: null, date: "2026-09-12", image: images.hero },
  { id: "n6", category: "gallery", landscape: "amazonia", program: "tororoi", date: "2026-08-25", image: images.landscapes.amazonia },
  { id: "n7", category: "institutional", landscape: null, program: null, date: "2026-11-05", image: images.hero },
  { id: "n8", category: "events", landscape: "beni", program: null, date: "2026-12-03", image: images.landscapes.beni },
];
