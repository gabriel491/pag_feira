import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PaginaErro from "./pages/PaginaErro";
import PerfilFeirante from "./pages/PerfilFeirante";
import CadastroCobrador from "./pages/CadastroCobrador";
import RelatorioCaixa from "./pages/RelatorioCaixa";
import RotaProtegida from "./components/RotaProtegida";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    element: (
      <RotaProtegida>
        <Outlet />{" "}
        {/* O Outlet representa qualquer rota filha que for acessada */}
      </RotaProtegida>
    ),
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/feirante/:id",
        element: <PerfilFeirante />,
      },
    ],
  },
  {
    path: "/cadastro-cobrador",
    element: (
      <RotaProtegida>
        <CadastroCobrador />
      </RotaProtegida>
    ),
  },
  {
    path: "/relatorio",
    element: (
      <RotaProtegida>
        <RelatorioCaixa />
      </RotaProtegida>
    ),
  },
  {
    path: "*",
    element: <PaginaErro />,
  },
]);