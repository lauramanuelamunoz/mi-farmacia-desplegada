import { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import toast from 'react-hot-toast';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUsuario = async (data) => {
    try {
      const response = await api.post('/usuarios', data);
      toast.success('Usuario creado exitosamente');
      await fetchUsuarios();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al crear usuario');
      throw error;
    }
  };

  const updateUsuario = async (id, data) => {
    try {
      const response = await api.put(`/usuarios/${id}`, data);
      toast.success('Usuario actualizado exitosamente');
      await fetchUsuarios();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al actualizar usuario');
      throw error;
    }
  };

  const deleteUsuario = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      toast.success('Usuario eliminado exitosamente');
      await fetchUsuarios();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al eliminar usuario');
      throw error;
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return {
    usuarios,
    loading,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    fetchUsuarios
  };
};