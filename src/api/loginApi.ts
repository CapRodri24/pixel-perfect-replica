const API_URL = (import.meta.env["VITE_API_URL"] || "http://localhost:5000/api").replace(/\/$/, "");
const TOKEN_KEY = "auth_token";

export type UsuarioSesion = {
  id_usuario: string;
  usuario: string;
};

type RespuestaLogin = {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    usuario: UsuarioSesion;
  };
};

type RespuestaSesion = {
  success: boolean;
  message?: string;
  data?: { usuario: UsuarioSesion };
};

async function leerRespuesta<T extends { success: boolean; message?: string }>(response: Response): Promise<T> {
  let resultado: T;
  try {
    resultado = (await response.json()) as T;
  } catch {
    throw new Error("El servidor devolvió una respuesta no válida.");
  }
  if (!response.ok || !resultado.success) {
    throw new Error(resultado.message || "No se pudo completar la solicitud.");
  }
  return resultado;
}

export async function iniciarSesion(usuario: string, contrasena: string): Promise<UsuarioSesion> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasena }),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }
  const resultado = await leerRespuesta<RespuestaLogin>(response);
  if (!resultado.data?.token || !resultado.data.usuario) {
    throw new Error("El servidor no devolvió los datos de sesión.");
  }
  localStorage.setItem(TOKEN_KEY, resultado.data.token);
  return resultado.data.usuario;
}

export async function obtenerSesionActual(): Promise<UsuarioSesion> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error("No existe una sesión activa.");
  let response: Response;
  try {
    response = await fetch(`${API_URL}/login/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }
  const resultado = await leerRespuesta<RespuestaSesion>(response);
  if (!resultado.data?.usuario) throw new Error("No se pudo verificar la sesión.");
  return resultado.data.usuario;
}

export function cerrarSesion(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function obtenerToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
