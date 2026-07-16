import React, { useState } from 'react';
import { useUsuarios } from '../hooks/useUsuarios';
import UsuarioTable from '../components/UsuarioTable';
import UsuarioForm from '../components/UsuarioForm';
import { Plus, RefreshCw, Shield } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';

const Usuarios = () => {
  const { usuario: currentUser } = useAuth();
  const { usuarios, loading, createUsuario, updateUsuario, deleteUsuario, fetchUsuarios } = useUsuarios();
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);

  // Solo admin puede ver esta página
  if (currentUser?.rol !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-yellow-400 mr-3" />
            <p className="text-yellow-700">
              No tienes permiso para ver esta página. Se requiere rol de administrador.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (id === currentUser.id) {
      alert('No puedes eliminar tu propio usuario');
      return;
    }
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      await deleteUsuario(id);
    }
  };

  const handleFormSubmit = async (data) => {
    if (editingUsuario) {
      await updateUsuario(editingUsuario.id, data);
    } else {
      await createUsuario(data);
    }
    setShowForm(false);
    setEditingUsuario(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-1">Gestiona los usuarios del sistema</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchUsuarios}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center"
          >
            <RefreshCw size={20} className="mr-2" />
            Actualizar
          </button>
          <button
            onClick={() => {
              setEditingUsuario(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus size={20} className="mr-2" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <UsuarioTable
          usuarios={usuarios}
          currentUserId={currentUser?.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingUsuario(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <UsuarioForm
                initialData={editingUsuario}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingUsuario(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;