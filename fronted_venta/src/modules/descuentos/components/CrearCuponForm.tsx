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
import type { CrearCuponRequest, TipoDescuento, CuponResponse } from '../types/cupon.types';
import { crearCupon, actualizarCupon } from '../services/cupon.service';

// --- MOCK DE HOOKS DE MUTACIÓN (Manteniendo el código anterior) ---
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

const useCreateCupon = () => useMutation(crearCupon);
const useUpdateCupon = (id: number) => useMutation((data) => actualizarCupon(id, data));

// --- FIN MOCK DE HOOKS ---

interface CrearCuponFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cuponDataToEdit: CuponResponse | null; 
}

// DEFINICIÓN DEL TIPO DE EVENTO COMBINADO PARA EL HANDLER
type FormChangeEventType = 
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> 
    | SelectChangeEvent<string | number | null>; 

const CrearCuponForm: React.FC<CrearCuponFormProps> = ({ // <-- CORRECCIÓN DE TIPOGRAFÍA APLICADA
  open,
  onClose,
  onSuccess,
  cuponDataToEdit,
}) => {
    
    // Valores iniciales por defecto (alineados con el DTO corregido)
    const initialFormData: CrearCuponRequest = {
        codigo: '',
        valor: 0,
        tipoDescuento: 'PORCENTAJE', 
        fechaExpiracion: new Date().toISOString().split('T')[0], 
        montoMinimoRequerido: 0,
        usosMaximos: null, 
    };

    const [formData, setFormData] = useState<CrearCuponRequest>(initialFormData);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!cuponDataToEdit;
    const cuponId = cuponDataToEdit?.id ?? 0;
    
    const createCupon = useCreateCupon();
    const updateCupon = useUpdateCupon(cuponId);
    const apiOperation = isEditing ? updateCupon : createCupon;
  
    useEffect(() => {
        if (cuponDataToEdit) {
            setFormData({
                codigo: cuponDataToEdit.codigo,
                valor: cuponDataToEdit.valor,
                tipoDescuento: cuponDataToEdit.tipoDescuento,
                fechaExpiracion: cuponDataToEdit.fechaExpiracion, 
                montoMinimoRequerido: cuponDataToEdit.montoMinimoRequerido,
                usosMaximos: cuponDataToEdit.usosMaximos,
            });
        } else {
            setFormData(initialFormData); 
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
    } else if (name === 'usosMaximos') {
        const stringValue = typeof value === 'string' ? value : String(value);
        const intValue = parseInt(stringValue, 10); 

        if (stringValue === '' || stringValue === '0' || isNaN(intValue)) {
            finalValue = null; 
        } else {
            finalValue = Math.max(1, intValue);
        }
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));

    setError(null);
    apiOperation.setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.codigo.trim()) {
      setError('El código es obligatorio.');
      return false;
    }
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
    
    const requestData: CrearCuponRequest = {
        ...formData,
        valor: parseFloat(formData.valor.toString()),
        montoMinimoRequerido: parseFloat(formData.montoMinimoRequerido.toString()),
        usosMaximos: formData.usosMaximos === 0 ? null : formData.usosMaximos,
    };

    try {
      if (isEditing) {
          await apiOperation.mutateAsync(requestData);
          alert('Cupón actualizado exitosamente.');
      } else {
          await apiOperation.mutateAsync(requestData);
          alert('Cupón creado exitosamente.');
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
      <DialogTitle id="form-dialog-title">{isEditing ? 'Editar Cupón Existente' : 'Crear Nuevo Cupón de Descuento'}</DialogTitle>
      <DialogContent>
        {(error || apiOperation.error) && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            **Error:** {error || (apiOperation.error instanceof Error ? apiOperation.error.message : 'Error desconocido de API')}
          </p>
        )}
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
        />
        
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
          ) : isEditing ? 'Guardar Cambios' : 'Crear Cupón'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearCuponForm;