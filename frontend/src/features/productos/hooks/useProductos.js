import { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import toast from 'react-hot-toast';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/productos');
      setProductos(response.data);
    } catch (error) {
      toast.error('Error al cargar productos');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProducto = async (data) => {
    try {
      const response = await api.post('/productos', data);
      toast.success('Producto creado exitosamente');
      await fetchProductos();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al crear producto');
      throw error;
    }
  };

  const updateProducto = async (id, data) => {
    try {
      const response = await api.put(`/productos/${id}`, data);
      toast.success('Producto actualizado exitosamente');
      await fetchProductos();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al actualizar producto');
      throw error;
    }
  };

  const deleteProducto = async (id) => {
    try {
      await api.delete(`/productos/${id}`);
      toast.success('Producto eliminado exitosamente');
      await fetchProductos();
    } catch (error) {
      toast.error('Error al eliminar producto');
      throw error;
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return { 
    productos, 
    loading, 
    createProducto, 
    updateProducto, 
    deleteProducto, 
    fetchProductos 
  };
};