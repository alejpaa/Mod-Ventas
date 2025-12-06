import { Route, Routes } from "react-router-dom"
import { PaginaVenta } from "./paginas/PaginaVenta"
import { PaginaCliente } from "./paginas/PaginaCliente"
import { PaginaCotizacion } from './modules/cotizacion/pages/PaginaCotizacion';
import { LayoutPrincipal } from './components/layout/LayoutPrincipal';
import { PaginaNoEncontrada } from "./paginas/PaginaNoEncontrada"
import Login from "./components/Login"
import { useRole } from "./contexts/RoleContext"
import { PaginaVendedor } from "./paginas/PaginaVendedor"
import { PaginaVentaDirecta } from "./paginas/PaginaVentaDirecta"
import { PaginaVentaLead } from "./paginas/PaginaVentaLead"
import PaginaCuponesAdmin from './paginas/PaginaCuponesAdmin';
import { PaginaCombos } from './paginas/PaginaCombos';

function App() {
  const { role } = useRole();

  if (!role) return <Login />;

  // Se ha cambiado la estructura para usar rutas anidadas y controlar el rol de forma más limpia.
  return (
    <Routes>
      <Route path="/" element={<LayoutPrincipal />}>
        <Route index element={<PaginaVenta />} />
        <Route path="registrar-venta" element={<PaginaVentaDirecta />} />
        <Route path="registrar-venta-lead" element={<PaginaVentaLead />} />
        <Route path="pagina-cotizacion" element={<PaginaCotizacion />} />
        <Route path="pagina-cliente" element={<PaginaCliente />} />
        <Route path="pagina-vendedor" element={<PaginaVendedor />} />
        <Route path="pagina-combos" element={<PaginaCombos />} />
        <Route path="/admin/cupones" element={<PaginaCuponesAdmin />} />
      </Route>

      <Route path="*" element={<PaginaNoEncontrada />}></Route>
    </Routes>
  );
}

export default App;