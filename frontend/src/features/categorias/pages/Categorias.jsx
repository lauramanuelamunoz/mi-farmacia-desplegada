import React, { useState } from 'react';
import { useCategorias } from '../hooks/useCategorias';
import CategoriaTable from '../components/CategoriaTable';
import CategoriaForm from '../components/CategoriaForm';
import { Plus, RefreshCw } from 'lucide-react';

const Categorias = () => {
  const { categorias, loading, createCategoria, updateCategoria, deleteCategoria, fetchCategorias } = useCategorias();
  const [showForm, setShowForm] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);

  const handleEdit = (categoria) => {
    setEditingCategoria(categoria);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      await deleteCategoria(id);
    }
  };

  const handleFormSubmit = async (data) => {
    if (editingCategoria) {
      await updateCategoria(editingCategoria.id, data);
    } else {
      await createCategoria(data);
    }
    setShowForm(false);
    setEditingCategoria(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-600 mt-1">Gestiona las categorías de productos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchCategorias}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center"
          >
            <RefreshCw size={20} className="mr-2" />
            Actualizar
          </button>
          <button
            onClick={() => {
              setEditingCategoria(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Plus size={20} className="mr-2" />
            Nueva Categoría
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <CategoriaTable
          categorias={categorias}
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
                  {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategoria(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <CategoriaForm
                initialData={editingCategoria}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingCategoria(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categorias;