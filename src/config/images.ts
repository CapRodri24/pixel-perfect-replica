// Central image registry. Replace these provisional photos with the official
// Google Drive photography (one per landscape) without touching components.
import hero from "@/assets/hero.jpg";
import beni from "@/assets/landscapes/beni.jpg";
import yungas from "@/assets/landscapes/yungas.jpg";
import andes from "@/assets/landscapes/andes.jpg";
import seco from "@/assets/landscapes/bosque-seco.jpg";
import amazonia from "@/assets/landscapes/amazonia.jpg";

export const images = {
  hero,
  landscapes: { beni, yungas, andes, seco, amazonia },
} as const;
