import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CriarBolao from './pages/CriarBolao'; 
import MeusBoloes from './pages/MeusBoloes';
import DetalhesBolao from './pages/DetalhesBolao'; 
import MeusPalpites from './pages/MeusPalpites';
import AcertosBolao from './pages/AcertosBolao';

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
        <Route path="/bolao/:id" element={<DetalhesBolao />} />
        <Route path="/meus-palpites" element={<MeusPalpites />} />
        <Route path="/acertos" element={<AcertosBolao/>} />
      </Routes>
    </Router>
  );
}

export default App;