import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../../api/axiosConfig';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = yup.object({
  metodo_pago: yup.string().required('Método de pago requerido'),
  detalles: yup.array().of(
    yup.object({
      producto_id: yup.number().required('Selecciona un producto'),
      cantidad: yup.number()
        .typeError('Cantidad requerida')
        .positive('Debe ser mayor a 0')
        .integer('Debe ser un número entero')
        .required('Cantidad requerida'),
    })
  ).min(1, 'Agrega al menos un producto'),
});

const VentaForm = ({ onSubmit, onCancel }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const { register, control, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      detalles: [{ producto_id: '', cantidad: 1 }],
      metodo_pago: 'efectivo'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'detalles'
  });

  const detalles = watch('detalles');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get('/productos');
        setProductos(response.data);
      } catch (error) {
        toast.error('Error al cargar productos');
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    let totalCalculado = 0;
    detalles.forEach((detalle, index) => {
      if (detalle.producto_id) {
        const producto = productos.find(p => p.id === parseInt(detalle.producto_id));
        if (producto) {
          totalCalculado += producto.precio * (detalle.cantidad || 0);
        }
      }
    });
    setTotal(totalCalculado);
  }, [detalles, productos]);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      const detallesConPrecio = data.detalles.map(detalle => {
        const producto = productos.find(p => p.id === parseInt(detalle.producto_id));
        return {
          ...detalle,
          producto_id: parseInt(detalle.producto_id),
          cantidad: parseInt(detalle.cantidad),
        };
      });

      await onSubmit({
        ...data,
        detalles: detallesConPrecio,
        total: total
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Método de Pago
        </label>
        <select
          {...register('metodo_pago')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta de Crédito/Débito</option>
          <option value="transferencia">Transferencia Bancaria</option>
        </select>
        {errors.metodo_pago && (
          <p className="text-sm text-red-600 mt-1">{errors.metodo_pago.message}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Productos
          </label>
          <button
            type="button"
            onClick={() => append({ producto_id: '', cantidad: 1 })}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Agregar Producto
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-3 items-end mb-3">
            <div className="flex-1">
              <select
                {...register(`detalles.${index}.producto_id`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccionar producto</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} - ${p.precio} (Stock: {p.stock})
                  </option>
                ))}
              </select>
              {errors.detalles?.[index]?.producto_id && (
                <p className="text-sm text-red-600 mt-1">Selecciona un producto</p>
              )}
            </div>

            <div className="w-24">
              <input
                {...register(`detalles.${index}.cantidad`)}
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.detalles?.[index]?.cantidad && (
                <p className="text-sm text-red-600 mt-1">Cantidad válida</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-800 p-2"
              disabled={fields.length === 1}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {errors.detalles?.message && (
          <p className="text-sm text-red-600">{errors.detalles.message}</p>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || total === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Procesando...' : 'Confirmar Venta'}
        </button>
      </div>
    </form>
  );
};

export default VentaForm;