// Traducción local del navegador. No utiliza claves ni servicios externos.
type TranslatorInstance = { translate: (text: string) => Promise<string>; destroy: () => void };
type TranslatorAPI = { availability: (options: {sourceLanguage:string;targetLanguage:string}) => Promise<string>; create: (options: {sourceLanguage:string;targetLanguage:string}) => Promise<TranslatorInstance> };
export const translationNotice = "Escribe todo en español: el inglés se genera automáticamente al guardar. Los nombres propios y archivos no se traducen.";
export async function withTranslator<T>(work:(translate:(text:string,html?:boolean)=>Promise<string>)=>Promise<T>):Promise<T>{
 const api=(globalThis as unknown as {Translator?:TranslatorAPI}).Translator;
 if(!api)throw new Error("La traducción automática no está disponible en este navegador. Usa Google Chrome actualizado (versión 138 o superior) en una computadora.");
 const options={sourceLanguage:"es",targetLanguage:"en"};
 if(await api.availability(options)==="unavailable")throw new Error("El traductor español→inglés del navegador no está disponible. Usa Google Chrome actualizado en una computadora.");
 const instance=await api.create(options);
 try{return await work(async (text,html=false)=>{
  if(!text.trim())return "";
  if(!html)return instance.translate(text);
  const doc=new DOMParser().parseFromString(text,"text/html");
  const walker=doc.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT);let node=walker.nextNode();
  while(node){const value=node.textContent??"";if(value.trim())node.textContent=await instance.translate(value);node=walker.nextNode();}
  return doc.body.innerHTML;
 });}finally{instance.destroy();}
}
export async function translateText(text:string):Promise<string>{return withTranslator(t=>t(text));}
