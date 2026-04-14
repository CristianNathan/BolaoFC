import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CriarBolao from './pages/CriarBolao'; 
import MeusBoloes from './pages/MeusBoloes';
import DetalhesBolao from './pages/DetalhesBolao'; // <-- Crie este arquivo em /pages
import MeusPalpites from './pages/MeusPalpites';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/criar-bolao" element={<CriarBolao />} /> 
        <Route path="/meus-boloes" element={<MeusBoloes/>} />
        {/* NOVA ROTA DINÂMICA */}
        <Route path="/bolao/:id" element={<DetalhesBolao />} />
        <Route path="/meus-palpites" element={<MeusPalpites />} />
      </Routes>
    </Router>
  );
}

export default App;