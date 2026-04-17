import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductOrder from './pages/ProductOrder';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/product/:id" element={<ProductOrder />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}