import React, { useState } from 'react';
import { useProductos } from '../hooks/useProductos';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import { Plus, Search, RefreshCw } from 'lucide-react';

const Productos = () => {
  const { 
    productos, 
    loading, 
    createProducto, 
    updateProducto, 
    deleteProducto,
    fetchProductos 
  } = useProductos();
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (producto) => {
    setEditingProduct(producto);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteProducto(id);
    }
  };

  const handleFormSubmit = async (data) => {
    if (editingProduct) {
      await updateProducto(editingProduct.id, data);
    } else {
      await createProducto(data);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-1">Gestiona el inventario de la farmacia</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Producto
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={fetchProductos}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center"
        >
          <RefreshCw size={20} className="mr-2" />
          Actualizar
        </button>
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <ProductTable
          productos={filteredProductos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <ProductForm
                initialData={editingProduct}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;