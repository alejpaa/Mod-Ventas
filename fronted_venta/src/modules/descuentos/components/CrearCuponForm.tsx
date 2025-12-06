import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  type SelectChangeEvent, 
} from '@mui/material';
// Se actualizan las importaciones para incluir los tipos de lote y el servicio
import type { 
    TipoDescuento, 
    CuponResponse, 
    CrearCuponRequest,
    CrearCuponLoteRequest 
} from '../types/cupon.types';
import { crearCuponesEnLote, actualizarCupon } from '../services/cupon.service';

// --- MOCK DE HOOKS DE MUTACIÓN (Actualizado para el nuevo servicio de creación) ---
const useMutation = (mutationFn: (data: any) => Promise<any>) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const mutateAsync = async (data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await mutationFn(data);
            setIsLoading(false);
            return result;
        } catch (e) {
            setIsLoading(false);
            setError(e);
            throw e; 
        }
    };
    return { isLoading, error, mutateAsync, setError };
};

// Hook para la creación de lotes (reemplaza a useCreateCupon)
const useCreateCuponesLote = () => useMutation(crearCuponesEnLote);
const useUpdateCupon = (id: number) => useMutation((data) => actualizarCupon(id, data as CrearCuponRequest));
// --- FIN MOCK DE HOOKS ---

interface CrearCuponFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cuponDataToEdit: CuponResponse | null; 
}

// Tipo combinado para el estado del formulario que soporta tanto creación por lote como edición
type FormDataType = CrearCuponRequest & CrearCuponLoteRequest; 

// Valores iniciales para el modo EDICIÓN
const initialEditData: CrearCuponRequest = {
    codigo: '',
    valor: 0,
    tipoDescuento: 'PORCENTAJE', 
    fechaExpiracion: new Date().toISOString().split('T')[0], 
    montoMinimoRequerido: 0,
    usosMaximos: null, 
};

// Valores iniciales para el modo CREACIÓN (LOTE)
const initialLoteData: CrearCuponLoteRequest = {
    nombreCampana: '',
    cantidadCupones: 1,
    valor: 10, // Valor de ejemplo
    tipoDescuento: 'PORCENTAJE', 
    fechaExpiracion: new Date().toISOString().split('T')[0], 
    montoMinimoRequerido: 0,
};


// DEFINICIÓN DEL TIPO DE EVENTO COMBINADO PARA EL HANDLER
type FormChangeEventType = 
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> 
    | SelectChangeEvent<string | number | null>; 

const CrearCuponForm: React.FC<CrearCuponFormProps> = ({ 
  open,
  onClose,
  onSuccess,
  cuponDataToEdit,
}) => {
    
    const isEditing = !!cuponDataToEdit;
    
    const initialCombinedData: FormDataType = isEditing
        ? { ...initialEditData, ...cuponDataToEdit, nombreCampana: '', cantidadCupones: 1 } // Al editar, inicializa los campos extra de lote a valores no relevantes
        : { ...initialEditData, ...initialLoteData }; // Al crear, usa los datos de lote

    const [formData, setFormData] = useState<FormDataType>(initialCombinedData);
    const [error, setError] = useState<string | null>(null);

    const cuponId = cuponDataToEdit?.id ?? 0;
    
    const createCuponesLote = useCreateCuponesLote(); // Nuevo hook para creación
    const updateCupon = useUpdateCupon(cuponId);
    const apiOperation = isEditing ? updateCupon : createCuponesLote; // Se selecciona la operación correcta

    // Resetea el formulario cuando se abre o el cupón de edición cambia
    useEffect(() => {
        if (cuponDataToEdit) {
            setFormData({
                // Campos de edición
                ...cuponDataToEdit,
                // Campos de lote (no relevantes para edición, se resetean)
                nombreCampana: '', 
                cantidadCupones: 1, 
            });
        } else {
            // Usa los valores iniciales para la creación por lote
            setFormData(initialCombinedData); 
        }
        setError(null);
        apiOperation.setError(null);
    }, [cuponDataToEdit, open]); 

  const handleChange = (e: FormChangeEventType) => { 
    const { name, value } = e.target;

    let finalValue: string | number | null = value;
    
    if (name === 'valor' || name === 'montoMinimoRequerido') {
        finalValue = parseFloat(value as string);
        if (isNaN(finalValue) || finalValue < 0) {
            finalValue = 0;
        }
    } else if (name === 'usosMaximos' || name === 'cantidadCupones') { // Se incluye cantidadCupones
        const stringValue = typeof value === 'string' ? value : String(value);
        const intValue = parseInt(stringValue, 10); 

        if (name === 'usosMaximos') {
             if (stringValue === '' || stringValue === '0' || isNaN(intValue)) {
                finalValue = null; 
            } else {
                finalValue = Math.max(1, intValue);
            }
        } else if (name === 'cantidadCupones') {
             if (isNaN(intValue) || intValue < 1) {
                finalValue = 1;
            } else {
                finalValue = intValue;
            }
        }
    } else if (name === 'nombreCampana') {
        // Asegurar que el nombre de campaña esté en mayúsculas y sin espacios iniciales/finales
        finalValue = (value as string).toUpperCase().trim();
    }


    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));

    setError(null);
    apiOperation.setError(null);
  };

  const validateForm = (): boolean => {
    // Validaciones específicas del modo CREACIÓN (LOTE)
    if (!isEditing) {
        if (!formData.nombreCampana.trim()) {
            setError('El nombre de la campaña es obligatorio.');
            return false;
        }
        if (formData.cantidadCupones < 1 || !Number.isInteger(formData.cantidadCupones)) {
            setError('La cantidad de cupones a crear debe ser un número entero mayor a 0.');
            return false;
        }
    } 
    // Validaciones específicas del modo EDICIÓN
    else if (isEditing && !formData.codigo.trim()) { 
      setError('El código es obligatorio para la edición.');
      return false;
    }
    
    // Validaciones comunes
    if (formData.valor <= 0) {
      setError('El valor del descuento debe ser mayor a 0.');
      return false;
    }
    if (
      formData.tipoDescuento === 'PORCENTAJE' &&
      formData.valor > 100
    ) {
      setError('El porcentaje de descuento no puede ser mayor a 100.');
      return false;
    }

    if (!formData.fechaExpiracion) {
        setError('La fecha de expiración es obligatoria.');
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expirationDate = new Date(formData.fechaExpiracion);

    if (expirationDate.getTime() < today.getTime()) {
      setError('La fecha de expiración debe ser posterior o igual a la fecha actual.');
      return false;
    }
    
    if (formData.montoMinimoRequerido < 0) {
        setError('El monto mínimo de compra no puede ser negativo.');
        return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditing) {
          // Lógica de EDICIÓN (usa CrearCuponRequest)
          const requestData: CrearCuponRequest = {
            codigo: formData.codigo,
            tipoDescuento: formData.tipoDescuento,
            valor: parseFloat(formData.valor.toString()),
            fechaExpiracion: formData.fechaExpiracion,
            usosMaximos: formData.usosMaximos === 0 ? null : formData.usosMaximos,
            montoMinimoRequerido: parseFloat(formData.montoMinimoRequerido.toString()),
          };
          await updateCupon.mutateAsync(requestData);
          alert('Cupón actualizado exitosamente.');
      } else {
          // Lógica de CREACIÓN POR LOTE (usa CrearCuponLoteRequest)
          const requestData: CrearCuponLoteRequest = {
            nombreCampana: formData.nombreCampana,
            cantidadCupones: formData.cantidadCupones,
            tipoDescuento: formData.tipoDescuento,
            valor: parseFloat(formData.valor.toString()),
            fechaExpiracion: formData.fechaExpiracion,
            montoMinimoRequerido: parseFloat(formData.montoMinimoRequerido.toString()),
            // El backend fuerza usosMaximos a 1, no se envía aquí
          };
          await createCuponesLote.mutateAsync(requestData); 
          alert(`¡${formData.cantidadCupones} cupones de la campaña ${formData.nombreCampana} creados exitosamente!`);
      }
      onSuccess();
    } catch (err: any) {
      const apiError =
        (err instanceof Error ? err.message : err?.response?.data?.message) ||
        `Error al ${isEditing ? 'actualizar' : 'crear'} el cupón. Intente de nuevo.`;
      setError(apiError);
    }
  };

  return (
    <Dialog 
        open={open} 
        onClose={onClose} 
        aria-labelledby="form-dialog-title"
        maxWidth="sm" 
        fullWidth
        BackdropProps={{ 
            style: { 
                backgroundColor: 'rgba(0, 0, 0, 0.3)', 
            },
        }}
    >
      <DialogTitle id="form-dialog-title">{isEditing ? 'Editar Cupón Existente' : 'Crear Lote de Cupones'}</DialogTitle>
      <DialogContent>
        {(error || apiOperation.error) && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            **Error:** {error || (apiOperation.error instanceof Error ? apiOperation.error.message : 'Error desconocido de API')}
          </p>
        )}
        
        {/* CAMPOS ESPECÍFICOS DE CREACIÓN POR LOTE */}
        {!isEditing && (
            <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="nombreCampana"
                  name="nombreCampana"
                  label="Nombre de Campaña (Prefijo del Código)"
                  type="text"
                  fullWidth
                  value={formData.nombreCampana}
                  onChange={handleChange}
                  required
                  helperText="Ej: NAVIDAD25. Generará códigos como NAVIDAD25001, etc."
                />
                <TextField
                  margin="dense"
                  id="cantidadCupones"
                  name="cantidadCupones"
                  label="Cantidad de Cupones a Crear"
                  type="number"
                  fullWidth
                  value={formData.cantidadCupones}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 1, step: 1 }}
                />
            </>
        )}
        
        {/* CAMPO ESPECÍFICO DE EDICIÓN */}
        {isEditing && (
            <TextField
              autoFocus
              margin="dense"
              id="codigo"
              name="codigo"
              label="Código de Cupón"
              type="text"
              fullWidth
              value={formData.codigo}
              onChange={handleChange}
              required
            />
        )}
        
        {/* CAMPOS COMUNES */}
        <FormControl fullWidth margin="dense" required>
          <InputLabel id="tipoDescuento-label">Tipo de Descuento</InputLabel>
          <Select
            labelId="tipoDescuento-label"
            id="tipoDescuento"
            name="tipoDescuento"
            value={formData.tipoDescuento}
            onChange={handleChange} 
            label="Tipo de Descuento"
          >
            <MenuItem value={'PORCENTAJE' as TipoDescuento}>Porcentaje (%)</MenuItem>
            <MenuItem value={'MONTO_FIJO' as TipoDescuento}>Monto Fijo</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          id="valor"
          name="valor"
          label={`Valor de Descuento (${
            formData.tipoDescuento === 'PORCENTAJE' ? '%' : 'S/'
          })`}
          type="number"
          fullWidth
          value={formData.valor}
          onChange={handleChange}
          required
          inputProps={{ 
              min: 0, 
              step: 0.01, 
              max: formData.tipoDescuento === 'PORCENTAJE' ? 100 : undefined 
          }} 
        />
        <TextField
          margin="dense"
          id="fechaExpiracion"
          name="fechaExpiracion"
          label="Fecha de Expiración"
          type="date"
          fullWidth
          value={formData.fechaExpiracion}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          margin="dense"
          id="montoMinimoRequerido"
          name="montoMinimoRequerido"
          label="Monto Mínimo de Compra (S/)"
          type="number"
          fullWidth
          value={formData.montoMinimoRequerido}
          onChange={handleChange}
          required
          inputProps={{ min: 0, step: 0.01 }}
        />
        
        {/* CAMPO ESPECÍFICO DE EDICIÓN (Usos Máximos) */}
        {isEditing && (
            <TextField
              margin="dense"
              id="usosMaximos"
              name="usosMaximos"
              label="Usos Máximos (0 o vacío = Ilimitado)"
              type="number"
              fullWidth
              value={formData.usosMaximos === null ? '' : formData.usosMaximos} 
              onChange={handleChange}
              inputProps={{ min: 0, step: 1 }}
              helperText="En modo de creación, este valor se ignora y se fuerza a '1' por cupón."
            />
        )}
        
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={apiOperation.isLoading}
        >
          {apiOperation.isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : isEditing ? 'Guardar Cambios' : 'Crear Lote'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearCuponForm;