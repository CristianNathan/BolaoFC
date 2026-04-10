import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login"; 
import Register from "./pages/Register";
import Bolao from "./pages/Bolao";
import Ranking from "./pages/Ranking";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. A rota "/" agora carrega o Login diretamente */}
        <Route path="/" element={<Login />} />
        
        {/* 2. Demais rotas do seu projeto */}
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bolao/:id" element={<Bolao />} />
        <Route path="/ranking/:id" element={<Ranking />} />

        {/* 3. (Opcional) Caso o usuário digite qualquer outra coisa, manda pro Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}