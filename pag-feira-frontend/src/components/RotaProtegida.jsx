import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function RotaProtegida({ children }) {
  const token = localStorage.getItem("token");

  // 1. Bloqueio imediato ANTES de tentar decodificar qualquer coisa
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Tenta ler o token de forma segura
  try {
    jwtDecode(token);
    return children;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
}