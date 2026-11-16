import { Navigate } from "react-router-dom";

export default function Login() {
  // Redirige al inicio automáticamente
  return <Navigate to="/" replace />;
}