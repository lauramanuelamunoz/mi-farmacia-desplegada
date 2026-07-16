import React, { useState, useEffect } from 'react';
import { useVentas } from '../hooks/useVentas';
import VentaForm from '../components/VentaForm';
import VentaTable from '../components/VentaTable';
import { Plus, RefreshCw } from 'lucide-react';

const Ventas = () => {
  const { ventas, loading, fetchVentas, createVenta, getVentaDetalle } = useVentas();
  const [showForm, setShowForm] = useState(false);

  const handleCreateVenta = async (data) => {
    await createVenta(data);
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
          <p className="text-gray-600 mt-1">Registro de ventas realizadas</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchVentas}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center"
          >
            <RefreshCw size={20} className="mr-2" />
            Actualizar
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus size={20} className="mr-2" />
            Nueva Venta
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <VentaTable ventas={ventas} getVentaDetalle={getVentaDetalle} />
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Nueva Venta</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <VentaForm
                onSubmit={handleCreateVenta}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;