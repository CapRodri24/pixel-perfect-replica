const API = String(import.meta.env["VITE_API_URL"] || "http://localhost:5000/api").replace(/\/+$/, "");
export type Category = "junta-directiva" | "equipo" | "socios";
export type Role = {id:string;name:string;nameEn:string};
export type Profile = {id:string;category:Category;name:string;description:string;descriptionEn:string;roleId:string;role:string;roleEn:string;partnerCategory:string;orden:number;imageId:string;image:string};
export const imagenNosotrosUrl = (id:string) => `${API}/nosotros/imagenes/${encodeURIComponent(id)}`;
async function request<T>(path:string,admin:boolean,method="GET",body?:unknown):Promise<T>{
 const headers:Record<string,string>={Accept:"application/json"};if(admin){const token=localStorage.getItem("auth_token");if(!token)throw new Error("Inicia sesión nuevamente.");headers["Authorization"]=`Bearer ${token}`;}
 if(body!==undefined)headers["Content-Type"]="application/json";
 const controller=new AbortController();const timer=window.setTimeout(()=>controller.abort(),method==="GET"?12000:60000);
 try{const r=await fetch(`${API}/${admin?"admin/":""}nosotros${path}`,{method,headers,signal:controller.signal,...(body===undefined?{}:{body:JSON.stringify(body)})});const j=await r.json() as {success:boolean;data:T;message?:string};if(!r.ok||!j.success)throw new Error(j.message||"No se pudo completar la operación.");return j.data;}catch(e){if(e instanceof TypeError||controller.signal.aborted)throw new Error("No se pudo conectar con el servidor.");throw e;}finally{window.clearTimeout(timer);}
}
export async function listarNosotros(admin=false):Promise<Profile[]>{const rows=await request<Omit<Profile,"image">[]>("",admin);if(!Array.isArray(rows))throw new Error("Respuesta inválida.");return rows.map(r=>({...r,image:imagenNosotrosUrl(r.imageId)}));}
export const listarCargos=()=>request<Role[]>("/cargos",true);
export const listarCategorias=(admin=false)=>request<Role[]>("/categorias",admin);
export const guardarPerfil=(p:Profile,editar:boolean)=>request<string>(editar?`/${encodeURIComponent(p.id)}`:"",true,editar?"PUT":"POST",{...p,image:p.image.startsWith("data:")?p.image:""});
/** Guarda el orden de presentación: los ids en el orden en que deben aparecer. */
export const reordenarPerfiles=(ids:string[])=>request<null>("/orden",true,"PUT",{ids});
export const borrarPerfil=(id:string)=>request<null>(`/${encodeURIComponent(id)}`,true,"DELETE");
export const guardarCargo=(r:Role,editar:boolean)=>request<string>(editar?`/cargos/${encodeURIComponent(r.id)}`:"/cargos",true,editar?"PUT":"POST",r);
export const borrarCargo=(id:string)=>request<null>(`/cargos/${encodeURIComponent(id)}`,true,"DELETE");
