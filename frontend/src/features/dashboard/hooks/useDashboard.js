import { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import toast from 'react-hot-toast';

export const useDashboard = () => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalUsuarios: 0,
    ventasHoy: 0,
    totalVentas: 0,
    productosTop: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/ventas/estadisticas');
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setError('Error al cargar estadísticas');
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, fetchStats };
};