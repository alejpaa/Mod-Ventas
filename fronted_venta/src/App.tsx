import { Route, Routes } from 'react-router-dom';
import { PaginaVenta } from './paginas/PaginaVenta';
import { PaginaCliente } from './paginas/PaginaCliente';
import { PaginaCotizacion } from './modules/cotizacion/pages/PaginaCotizacion';
import { LayoutPrincipal } from './components/layout/LayoutPrincipal';
import { PaginaNoEncontrada } from './paginas/PaginaNoEncontrada';
import Login from './components/Login';
import { useRole } from './contexts/RoleContext';
import { PaginaVendedor } from './paginas/PaginaVendedor';
import { PaginaVentaDirecta } from './paginas/PaginaVentaDirecta';

function App() {
  const { role } = useRole();

  if (!role) return <Login />;

  return (
    // Si agregan lo de producto y descuento como página
    // Tendría que modificarlo en el LayoutPrincipal.tsx para agregar los links si va para vendedor o admin
    // Y dentro de esta Route agregan las rutas respectivas
    <Routes>
      <Route path="/" element={<LayoutPrincipal />}>
        <Route index element={<PaginaVenta />} />
        <Route path="registrar-venta" element={<PaginaVentaDirecta />} />
        <Route path="pagina-cotizacion" element={<PaginaCotizacion />} />
        <Route path="pagina-cliente" element={<PaginaCliente />} />
        <Route path="pagina-vendedor" element={<PaginaVendedor />} />
      </Route>

      <Route path="*" element={<PaginaNoEncontrada />}></Route>
    </Routes>
  );
}

export default App;
