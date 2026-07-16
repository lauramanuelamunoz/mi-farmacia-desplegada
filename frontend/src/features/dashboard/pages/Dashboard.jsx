import React, { useState, useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import DashboardCards from '../components/DashboardCards';
import ProductChart from '../components/ProductChart';
import RecentSales from '../components/RecentSales';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
  const { stats, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Error al cargar el dashboard
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen general de la farmacia</p>
      </div>

      {/* Cards */}
      <DashboardCards data={stats} />

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Productos más vendidos</h2>
          <ProductChart data={stats.productosTop || []} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Ventas Recientes</h2>
          <RecentSales />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-100 text-blue-700 p-4 rounded-lg hover:bg-blue-200 transition">
            Nueva Venta
          </button>
          <button className="bg-green-100 text-green-700 p-4 rounded-lg hover:bg-green-200 transition">
            Agregar Producto
          </button>
          <button className="bg-yellow-100 text-yellow-700 p-4 rounded-lg hover:bg-yellow-200 transition">
            Actualizar Stock
          </button>
          <button className="bg-purple-100 text-purple-700 p-4 rounded-lg hover:bg-purple-200 transition">
            Ver Reportes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;