import { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import toast from 'react-hot-toast';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (error) {
      toast.error('Error al cargar categorías');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCategoria = async (data) => {
    try {
      const response = await api.post('/categorias', data);
      toast.success('Categoría creada exitosamente');
      await fetchCategorias();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al crear categoría');
      throw error;
    }
  };

  const updateCategoria = async (id, data) => {
    try {
      const response = await api.put(`/categorias/${id}`, data);
      toast.success('Categoría actualizada exitosamente');
      await fetchCategorias();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al actualizar categoría');
      throw error;
    }
  };

  const deleteCategoria = async (id) => {
    try {
      await api.delete(`/categorias/${id}`);
      toast.success('Categoría eliminada exitosamente');
      await fetchCategorias();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al eliminar categoría');
      throw error;
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    categorias,
    loading,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    fetchCategorias
  };
};