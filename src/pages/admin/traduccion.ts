// Traducción local del navegador. No utiliza claves ni servicios externos.
type TranslatorInstance = { translate: (text: string) => Promise<string>; destroy: () => void };
type TranslatorAPI = { availability: (options: {sourceLanguage:string;targetLanguage:string}) => Promise<string>; create: (options: {sourceLanguage:string;targetLanguage:string}) => Promise<TranslatorInstance> };
export const translationNotice = "El inglés se genera al guardar los campos pendientes. Si el navegador no admite traducción local ES→EN, completa o revisa la versión inglesa manualmente. Los nombres propios y archivos no se traducen.";
export async function withTranslator<T>(work:(translate:(text:string,html?:boolean)=>Promise<string>)=>Promise<T>):Promise<T>{
 const api=(globalThis as unknown as {Translator?:TranslatorAPI}).Translator;
 if(!api)throw new Error("Traducción automática no disponible en este navegador. Completa el inglés manualmente.");
 const options={sourceLanguage:"es",targetLanguage:"en"};
 if(await api.availability(options)==="unavailable")throw new Error("El modelo ES→EN no está disponible. Completa el inglés manualmente.");
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
