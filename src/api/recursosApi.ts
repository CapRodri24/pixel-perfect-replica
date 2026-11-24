const API = String(import.meta.env["VITE_API_URL"] || "http://localhost:5000/api").replace(/\/+$/, "");
export type CategoriaRecurso = {id:string;name:string;nameEn:string};
export type PdfRecurso = {id:string;name:string;size:number;data?:string};
export type Recurso = {id:string;type:string;title:string;titleEn:string;description:string;descriptionEn:string;imageId:string;date:string;files:PdfRecurso[];imageData?:string};
export const imagenRecursoUrl=(id:string)=>`${API}/recursos/imagenes/${encodeURIComponent(id)}`;
export const pdfRecursoUrl=(id:string)=>`${API}/recursos/pdf/${encodeURIComponent(id)}`;
async function request<T>(path:string,admin:boolean,method="GET",body?:unknown):Promise<T>{
 const headers:Record<string,string>={Accept:"application/json"};if(admin){const token=localStorage.getItem("auth_token");if(!token)throw new Error("Inicia sesión nuevamente.");headers["Authorization"]=`Bearer ${token}`;}
 if(body!==undefined)headers["Content-Type"]="application/json";
 const ctrl=new AbortController();const timer=window.setTimeout(()=>ctrl.abort(),method==="GET"?12000:120000);
 try{const r=await fetch(`${API}/${admin?"admin/":""}recursos${path}`,{method,headers,signal:ctrl.signal,...(body===undefined?{}:{body:JSON.stringify(body)})});const j=await r.json() as {success:boolean;data:T;message?:string};if(!r.ok||!j.success)throw new Error(j.message||"No se pudo completar la operación.");return j.data;}catch(e){if(e instanceof TypeError||ctrl.signal.aborted)throw new Error("No se pudo conectar con el servidor.");throw e;}finally{window.clearTimeout(timer);}
}
export const listarRecursos=(admin=false)=>request<Recurso[]>("",admin);
export const listarTiposRecurso=(admin=false)=>request<CategoriaRecurso[]>("/categorias",admin);
export const obtenerRecurso=(id:string)=>request<Recurso>(`/${encodeURIComponent(id)}`,false);
export const guardarRecurso=(r:Recurso)=>request<string>(r.id?`/${encodeURIComponent(r.id)}`:"",true,r.id?"PUT":"POST",r);
export const borrarRecurso=(id:string)=>request<null>(`/${encodeURIComponent(id)}`,true,"DELETE");
export async function descargarPdf(id:string,name:string){const c=new AbortController();const timer=window.setTimeout(()=>c.abort(),60000);try{const r=await fetch(pdfRecursoUrl(id),{signal:c.signal});if(!r.ok||!r.headers.get("content-type")?.includes("application/pdf"))throw new Error("PDF no disponible.");const url=URL.createObjectURL(await r.blob());const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),30000);}finally{window.clearTimeout(timer);}}
