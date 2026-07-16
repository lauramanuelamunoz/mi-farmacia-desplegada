import { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import toast from 'react-hot-toast';

export const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVentas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/ventas');
      setVentas(response.data);
    } catch (error) {
      toast.error('Error al cargar ventas');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createVenta = async (data) => {
    try {
      const response = await api.post('/ventas', data);
      toast.success('Venta registrada exitosamente');
      await fetchVentas();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al registrar venta');
      throw error;
    }
  };

  const getVentaDetalle = async (id) => {
    try {
      const response = await api.get(`/ventas/${id}`);
      return response.data;
    } catch (error) {
      toast.error('Error al obtener detalle de venta');
      throw error;
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  return { ventas, loading, fetchVentas, createVenta, getVentaDetalle };
};