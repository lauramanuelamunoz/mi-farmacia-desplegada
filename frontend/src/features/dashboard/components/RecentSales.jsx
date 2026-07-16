import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const RecentSales = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await api.get('/ventas?limit=5');
        setVentas(response.data.slice(0, 5));
      } catch (error) {
        console.error('Error al cargar ventas recientes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  if (ventas.length === 0) {
    return <div className="text-gray-500 text-center py-8">No hay ventas recientes</div>;
  }

  return (
    <div className="overflow-hidden">
      <div className="flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {ventas.map((venta) => (
            <li key={venta.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Venta #{venta.id}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {venta.usuario_nombre || 'Usuario'}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm font-semibold text-gray-900">
                    ${Number(venta.total).toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(venta.fecha), "d 'de' MMMM, HH:mm", { locale: es })}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentSales;