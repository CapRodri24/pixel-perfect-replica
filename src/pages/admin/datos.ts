import { useState } from "react";

export type BlockType = "title" | "subtitle" | "text" | "image" | "gallery" | "video";
export type Block = { id: string; type: BlockType; value: string; valueEn: string; caption: string; captionEn: string; images: string[] };
export type Editorial = { id: string; blocks: Block[]; landscapeId: string; programId: string; category: string; date: string; color: string };
export type Person = { id: string; name: string; role: string; roleEn: string; description: string; descriptionEn: string; image: string; group: string };
export type ResourceAttachment = { id:string; name:string; mime:string; data:string };
export type Resource = { id: string; type: string; title: string; titleEn: string; description: string; descriptionEn: string; year: string; format: string; url: string; files: ResourceAttachment[] };
export const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const today = () => new Date().toISOString().slice(0, 10);
export const newBlock = (type: BlockType, value = "", valueEn = ""): Block => ({ id: uid(), type, value, valueEn, caption: "", captionEn: "", images: [] });
export const newEditorial = (): Editorial => ({ id: uid(), blocks: [newBlock("title")], landscapeId: "", programId: "", category: "institutional", date: today(), color: "#2381C4" });
export const keys = { paisajes: "admin_paisajes", programas: "admin_programas", noticias: "admin_noticias", equipo: "admin_equipo", recursos: "admin_recursos" } as const;
export const newsTypes = [["institutional","Noticias institucionales"],["stories","Historias de conservación"],["events","Agenda y eventos"],["social","Redes sociales"],["videos","Videos de YouTube"],["infographics","Infografías"],["gallery","Fotogalería / Flickr"]] as const;
export const resourceTypes = [["informes","Informes y memorias"],["publicaciones","Publicaciones científicas y técnicas"],["sig","Recursos SIG / mapas"],["colaboraciones","Colaboraciones"],["legales","Herramientas legales"]] as const;
export const groups = [["direccion","Dirección"],["programas","Programas"],["apoyo","Áreas de apoyo"]] as const;
export const demoLandscapes: Editorial[] = [["beni","Pastizales del Beni","Beni Grasslands","#9b793c","1"],["yungas","Yungas","Yungas","#34734e","2"],["andes","Andes Altos","High Andes","#648497","3"],["seco","Bosque Seco Interandino","Inter-Andean Dry Forest","#ad7851","4"],["amazonia","Amazonía","Amazon","#668f37","5"]].map(([id,es,en,color,img]) => ({ ...newEditorial(), id: id!, color: color!, blocks: [newBlock("title",es!,en!),newBlock("text","Contenido de demostración del paisaje.","Sample landscape content."),newBlock("image",`/images/home/${img}.jpg`)] }));
export const demoPrograms: Editorial[] = [{...newEditorial(),id:"barbaazul",landscapeId:"beni",blocks:[newBlock("title","Paraba Barba Azul","Blue-throated Macaw"),newBlock("text","Ejemplo de programa de conservación.","Sample conservation programme.")]}];
export const demoNews: Editorial[] = [{...newEditorial(),id:"demo-n1",programId:"barbaazul",category:"stories",blocks:[newBlock("title","Monitoreo de aves — ejemplo","Bird monitoring — sample"),newBlock("text","Noticia de demostración asociada a un programa.","Sample news linked to a programme.")]},{...newEditorial(),id:"demo-n2",blocks:[newBlock("title","Noticias institucionales — ejemplo","Institutional news — sample"),newBlock("text","Noticia independiente de demostración.","Independent sample news.")]}];
const asObject = (v: unknown): Record<string,unknown> => v !== null && typeof v === "object" ? v as Record<string,unknown> : {};
const str = (v: unknown, fallback = "") => typeof v === "string" ? v : fallback;
const blockTypes: BlockType[] = ["title","subtitle","text","image","gallery","video"];
export function normalizeEditorial(raw: unknown): Editorial {
  const r = asObject(raw);
  const blocks = Array.isArray(r["blocks"]) ? r["blocks"].map((x: unknown) => {const b=asObject(x);const type=blockTypes.includes(b["type"] as BlockType)?b["type"] as BlockType:"text";return {...newBlock(type),id:str(b["id"],uid()),value:str(b["value"]),valueEn:str(b["valueEn"]),caption:str(b["caption"]),captionEn:str(b["captionEn"]),images:Array.isArray(b["images"])?b["images"].filter((v:unknown):v is string=>typeof v==="string"):[]};}) : [newBlock("title",str(r["title"])),newBlock("text",str(r["text"])),...(str(r["image"])?[newBlock("image",str(r["image"]))]:[]),...(str(r["youtubeUrl"])?[newBlock("video",str(r["youtubeUrl"]))]:[])];
  if (!blocks.some(b=>b["type"]==="title")) blocks.unshift(newBlock("title",str(r["title"])));
  return {...newEditorial(),id:str(r["id"],uid()),blocks,landscapeId:str(r["landscapeId"],str(r["paisajeId"])),programId:str(r["programId"]),category:str(r["category"],"institutional"),date:str(r["date"],today()),color:str(r["color"],"#2381C4")};
}
export function normalizePerson(raw: unknown): Person {const r=asObject(raw);return {id:str(r["id"],uid()),name:str(r["name"]),role:str(r["role"]),roleEn:str(r["roleEn"]),description:str(r["description"]),descriptionEn:str(r["descriptionEn"]),image:str(r["image"]),group:str(r["group"],"programas")};}
export function normalizeResource(raw: unknown): Resource {const r=asObject(raw);return {id:str(r["id"],uid()),type:str(r["type"],"informes"),title:str(r["title"]),titleEn:str(r["titleEn"]),description:str(r["description"]),descriptionEn:str(r["descriptionEn"]),year:String(r["year"]??new Date().getFullYear()),format:str(r["format"],"PDF"),url:str(r["url"]),files:Array.isArray(r["files"])?r["files"].map((x:unknown)=>{const f=asObject(x);return {id:str(f["id"],uid()),name:str(f["name"]),mime:str(f["mime"]),data:str(f["data"])};}).filter((f:ResourceAttachment)=>Boolean(f.name&&f.data)):[]};}
export function readList<T>(key: string, normalize: (r:unknown)=>T, fallback: T[] = [], legacy?: string): T[] {try {const raw=localStorage.getItem(key)??(legacy?localStorage.getItem(legacy):null);if(raw===null)return fallback;const parsed:unknown=JSON.parse(raw);return Array.isArray(parsed)?parsed.map(normalize):fallback;}catch{return fallback;}}
export function useStore<T>(key: string, normalize:(v:unknown)=>T, fallback:T[]=[], legacy?:string) {const [items,setItems]=useState<T[]>(()=>readList(key,normalize,fallback,legacy));function save(next:T[]){try{localStorage.setItem(key,JSON.stringify(next));setItems(next);return "";}catch{return "No se pudo guardar. El almacenamiento local puede estar lleno; reduce el tamaño de los archivos.";}}return {items,save};}
export const readLandscapes=()=>readList(keys.paisajes,normalizeEditorial,demoLandscapes);
export const readPrograms=()=>readList(keys.programas,normalizeEditorial,demoPrograms);
export const readNews=()=>readList(keys.noticias,normalizeEditorial,demoNews);
export const plain=(html:string)=>{const doc=new DOMParser().parseFromString(html,"text/html");return doc.body.textContent?.trim()??"";};
export const titleOf=(r:Editorial)=>plain(r.blocks.find(b=>b.type==="title")?.value??"")||"Sin título";
export const textOf=(r:Editorial)=>plain(r.blocks.find(b=>b.type==="text")?.value??"");
export const imageOf=(r:Editorial)=>r.blocks.find(b=>b.type==="image"&&b.value)?.value??r.blocks.find(b=>b.type==="gallery")?.images[0]??"";
export function safeUrl(value:string, image=false):boolean {if(!value)return false;if(image&&(/^data:image\/(png|jpeg|webp|gif);base64,/i.test(value)||/^\/(?!\/)/.test(value)))return true;try{const u=new URL(value);return u.protocol==="https:"||u.protocol==="http:";}catch{return false;}}
export function youtubeId(value:string):string|null {try{const u=new URL(value);if(!["https:","http:"].includes(u.protocol))return null;let id:string|null=null;if(u.hostname==="youtu.be")id=u.pathname.split("/")[1]??null;else if(["youtube.com","www.youtube.com","m.youtube.com","www.youtube-nocookie.com","youtube-nocookie.com"].includes(u.hostname))id=u.searchParams.get("v")??u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1]??null;return id&&/^[\w-]{11}$/.test(id)?id:null;}catch{return null;}}
// Filtra el HTML de los párrafos: solo formato básico, listas, alineación y enlaces seguros.
export function sanitize(html:string):string {
  const doc=new DOMParser().parseFromString(html,"text/html");
  const allowed=new Set(["B","STRONG","I","EM","U","S","STRIKE","BR","P","DIV","SPAN","UL","OL","LI","A"]);
  for(const el of Array.from(doc.body.querySelectorAll("*"))){
    if(!el.isConnected)continue;
    if(["SCRIPT","STYLE","IFRAME","OBJECT","SVG","MATH","TEMPLATE"].includes(el.tagName)){el.remove();continue;}
    if(!allowed.has(el.tagName)){el.replaceWith(...Array.from(el.childNodes));continue;}
    const align=(el as HTMLElement).style?.textAlign;
    const href=el.tagName==="A"?enlaceSeguro(el.getAttribute("href")||""):null;
    for(const a of Array.from(el.attributes))el.removeAttribute(a.name);
    if(align&&["left","right","center","justify"].includes(align))(el as HTMLElement).style.textAlign=align;
    if(el.tagName==="A"){
      if(!href){el.replaceWith(...Array.from(el.childNodes));continue;}
      el.setAttribute("href",href);
      if(!href.startsWith("mailto:")){el.setAttribute("target","_blank");el.setAttribute("rel","noopener noreferrer");}
    }
  }
  return doc.body.innerHTML;
}
/** Devuelve el enlace normalizado si es http(s) o mailto; si no, null. */
export function enlaceSeguro(valor:string):string|null{
  const v=valor.trim();
  if(!v)return null;
  const conEsquema=/^[a-z][a-z0-9+.-]*:/i.test(v)?v:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?`mailto:${v}`:`https://${v.replace(/^\/+/,"")}`;
  try{const u=new URL(conEsquema);return ["http:","https:","mailto:"].includes(u.protocol)?u.href:null;}catch{return null;}
}
export async function imageFile(file:File):Promise<string>{if(!["image/jpeg","image/png","image/webp","image/gif"].includes(file.type))throw new Error("Selecciona una imagen JPG, PNG, WEBP o GIF.");if(file.size>10*1024*1024)throw new Error("La imagen supera 10 MB.");const source=await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(new Error("No se pudo leer la imagen."));r.readAsDataURL(file);});const img=await new Promise<HTMLImageElement>((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error("Imagen no válida."));i.src=source;});const scale=Math.min(1,1400/Math.max(img.width,img.height));const c=document.createElement("canvas");c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));const ctx=c.getContext("2d");if(!ctx)throw new Error("No se pudo procesar la imagen.");ctx.drawImage(img,0,0,c.width,c.height);return c.toDataURL("image/webp",.80);}
