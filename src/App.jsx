// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home            from "./pages/Home.jsx"
import Planes          from "./pages/Planes.jsx"
import Login           from "./pages/Login.jsx"
import SignUp          from "./pages/SignUp.jsx"
import FAQs            from "./pages/FAQs.jsx"
import SobreMi         from "./pages/SobreMi.jsx"
import Contacto        from "./pages/Contact.jsx"
import Blog            from "./pages/Blog.jsx"
import Reto            from "./pages/Challenge.jsx"
import Videos          from "./pages/Videos.jsx"
import Tienda          from "./pages/Tienda.jsx"
import Producto        from "./pages/Producto.jsx"
import Carrito         from "./pages/Carrito.jsx"
import Ingresa         from "./pages/IngresarDinero.jsx"
import RealizaPedido   from "./pages/TramitarPedido.jsx"
import Admin           from "./pages/Admin.jsx"
import PagoInmediato   from "./pages/PagoInmediato.jsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"                 element={<Home />} />
        <Route path="/planes"           element={<Planes />} />
        <Route path="/login"            element={<Login />} />
        <Route path="/signup"           element={<SignUp />} />
        <Route path="/faqs"             element={<FAQs />} />
        <Route path="/sobremi"          element={<SobreMi />} />
        <Route path="/contacto"         element={<Contacto />} />
        <Route path="/blog"             element={<Blog />} />
        <Route path="/reto/:id"         element={<Reto />} />
        <Route path="/videos"           element={<Videos />} />
        <Route path="/tienda"           element={<Tienda />} />
        <Route path="/producto/:id"     element={<Producto />} />
        <Route path="/carrito"          element={<Carrito />} />
        <Route path="/ingresardinero"   element={<Ingresa />} />
        <Route path="/realizarpedido"   element={<RealizaPedido />} />
        <Route path="/admin/*"          element={<Admin />} />
        <Route path="/pago"   element={<PagoInmediato />} />
      </Routes>
    </Router>
  )
}

export default App
