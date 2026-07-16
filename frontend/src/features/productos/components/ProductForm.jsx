import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../../api/axiosConfig';

const schema = yup.object({
  nombre: yup.string().required('Nombre requerido').min(3, 'Mínimo 3 caracteres'),
  descripcion: yup.string(),
  precio: yup.number()
    .typeError('Debe ser un número')
    .positive('Debe ser mayor a 0')
    .required('Precio requerido'),
  stock: yup.number()
    .typeError('Debe ser un número')
    .integer('Debe ser un número entero')
    .min(0, 'No puede ser negativo')
    .required('Stock requerido'),
  categoria_id: yup.number().typeError('Selecciona una categoría'),
  codigo_barras: yup.string(),
  fecha_vencimiento: yup.date().typeError('Fecha inválida'),
});

const ProductForm = ({ initialData, onSubmit, onCancel }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {}
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get('/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            {...register('nombre')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.nombre && (
            <p className="text-sm text-red-600 mt-1">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código de Barras
          </label>
          <input
            {...register('codigo_barras')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.codigo_barras && (
            <p className="text-sm text-red-600 mt-1">{errors.codigo_barras.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio *
          </label>
          <input
            {...register('precio')}
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.precio && (
            <p className="text-sm text-red-600 mt-1">{errors.precio.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock *
          </label>
          <input
            {...register('stock')}
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.stock && (
            <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            {...register('categoria_id')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sin categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          {errors.categoria_id && (
            <p className="text-sm text-red-600 mt-1">{errors.categoria_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Vencimiento
          </label>
          <input
            {...register('fecha_vencimiento')}
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.fecha_vencimiento && (
            <p className="text-sm text-red-600 mt-1">{errors.fecha_vencimiento.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          {...register('descripcion')}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.descripcion && (
          <p className="text-sm text-red-600 mt-1">{errors.descripcion.message}</p>
        )}
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
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;