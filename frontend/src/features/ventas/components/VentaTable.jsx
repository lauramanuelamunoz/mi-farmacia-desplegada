import React, { useState } from 'react';
import { Eye, ShoppingCart, Calendar, User, CreditCard, DollarSign, Package, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const VentaTable = ({ ventas, getVentaDetalle }) => {
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const handleVerDetalle = async (venta) => {
    setLoadingDetalle(true);
    try {
      const ventaCompleta = await getVentaDetalle(venta.id);
      setSelectedVenta(ventaCompleta);
    } finally {
      setLoadingDetalle(false);
    }
  };

  if (ventas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay ventas</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza registrando una nueva venta.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método de Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ventas.map((venta) => (
              <tr key={venta.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  #{venta.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(venta.fecha), "d 'de' MMMM, yyyy HH:mm", { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {venta.usuario_nombre || 'Usuario'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    venta.metodo_pago === 'efectivo' ? 'bg-green-100 text-green-800' :
                    venta.metodo_pago === 'tarjeta' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {venta.metodo_pago || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  ${Number(venta.total).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleVerDetalle(venta)}
                    disabled={loadingDetalle}
                    className="text-blue-600 hover:text-blue-900 transition disabled:opacity-50"
                  >
                    {loadingDetalle ? (
                      <div className="animate-spin h-5 w-5 border-b-2 border-blue-600 rounded-full"></div>
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para ver detalles */}
      {selectedVenta && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <ShoppingCart className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Detalle de Venta #{selectedVenta.id}</h2>
              </div>
              <button
                onClick={() => setSelectedVenta(null)}
                className="text-white/80 hover:text-white transition p-2 hover:bg-white/20 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="flex-1 overflow-y-auto p-8">
              {/* Tarjetas de información */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="text-blue-600" size={20} />
                    <p className="text-sm text-blue-700 font-medium">Fecha</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {format(new Date(selectedVenta.fecha), "d 'de' MMMM", { locale: es })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(selectedVenta.fecha), "HH:mm", { locale: es })}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="text-green-600" size={20} />
                    <p className="text-sm text-green-700 font-medium">Usuario</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{selectedVenta.usuario_nombre || 'Usuario'}</p>
                </div>

                <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="text-purple-600" size={20} />
                    <p className="text-sm text-purple-700 font-medium">Método de Pago</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{selectedVenta.metodo_pago || 'N/A'}</p>
                </div>

                <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="text-orange-600" size={20} />
                    <p className="text-sm text-orange-700 font-medium">Total</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">${Number(selectedVenta.total).toFixed(2)}</p>
                </div>
              </div>

              {/* Lista de Productos */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Package className="text-gray-700" size={20} />
                  <h3 className="text-xl font-bold text-gray-900">Productos</h3>
                </div>
                
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="col-span-6">Producto</div>
                    <div className="col-span-2 text-center">Cantidad</div>
                    <div className="col-span-2 text-right">Precio Unitario</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>
                  
                  {selectedVenta.detalles && selectedVenta.detalles.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {selectedVenta.detalles.map((detalle, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white transition">
                          <div className="col-span-6">
                            <p className="font-medium text-gray-900">{detalle.producto_nombre || `Producto ${detalle.producto_id}`}</p>
                          </div>
                          <div className="col-span-2 text-center">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                              {Number(detalle.cantidad)}
                            </span>
                          </div>
                          <div className="col-span-2 text-right text-gray-600 font-medium">
                            ${Number(detalle.precio_unitario).toFixed(2)}
                          </div>
                          <div className="col-span-2 text-right font-bold text-gray-900">
                            ${Number(detalle.subtotal).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-6 py-8 text-center">
                      <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500">No hay detalles disponibles</p>
                    </div>
                  )}
                </div>

                {/* Total Final */}
                {selectedVenta.detalles && selectedVenta.detalles.length > 0 && (
                  <div className="mt-6 flex justify-end">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl shadow-lg">
                      <p className="text-sm text-green-100 mb-1">Total</p>
                      <p className="text-3xl font-bold">${Number(selectedVenta.total).toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VentaTable;