// src/paginas/PaginaCuponesAdmin.tsx
import CrearCuponForm from '../modules/descuentos/components/CrearCuponForm';

const PaginaCuponesAdmin = () => {
  // Función de manejo para recargar la lista de cupones, etc.
  const handleSuccess = () => {
    console.log("Cupón creado y lista debe actualizarse.");
    // Aquí podrías agregar lógica para listar los cupones existentes después de la creación
  };

  // Nota: En una aplicación real, probablemente querrías un modal para el formulario,
  // pero aquí lo ponemos directamente en la página.
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Administración de Descuentos</h1>
      <div className="max-w-xl mx-auto">
        <CrearCuponForm onSuccess={handleSuccess} onCancel={() => console.log('Creación cancelada')} />
      </div>
    </div>
  );
};

export default PaginaCuponesAdmin;