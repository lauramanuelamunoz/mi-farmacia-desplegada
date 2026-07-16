import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { authService } from '../../auth/authService';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Perfil = () => {
  const { usuario } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await authService.getPerfil();
        setPerfil(data);
      } catch (error) {
        toast.error('Error al cargar perfil');
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-3">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white">{perfil?.nombre}</h1>
              <p className="text-blue-100">Mi Perfil</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">{perfil?.nombre}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{perfil?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Rol</p>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  perfil?.rol === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {perfil?.rol === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Miembro desde</p>
                <p className="font-medium">
                  {perfil?.created_at 
                    ? new Date(perfil.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Rol</p>
                <p className="text-lg font-bold text-blue-900">
                  {perfil?.rol === 'admin' ? 'Administrador' : 'Usuario'}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">ID de Usuario</p>
                <p className="text-lg font-bold text-green-900">#{perfil?.id}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Estado</p>
                <p className="text-lg font-bold text-purple-900">Activo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;