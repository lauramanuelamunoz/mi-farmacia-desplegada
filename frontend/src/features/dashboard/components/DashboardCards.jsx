import React from 'react';
import { Package, Users, DollarSign, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';

const DashboardCards = ({ data }) => {
  const cards = [
    { 
      icon: Package, 
      label: 'Total Productos', 
      value: data.totalProductos || 0, 
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up'
    },
    { 
      icon: Users, 
      label: 'Usuarios', 
      value: data.totalUsuarios || 0, 
      color: 'bg-green-500',
      change: '+5%',
      trend: 'up'
    },
    { 
      icon: DollarSign, 
      label: 'Ventas Hoy', 
      value: `$${data.ventasHoy?.toFixed(2) || '0.00'}`, 
      color: 'bg-yellow-500',
      change: '+8%',
      trend: 'up'
    },
    { 
      icon: ShoppingCart, 
      label: 'Total Ventas', 
      value: data.totalVentas || 0, 
      color: 'bg-purple-500',
      change: '-3%',
      trend: 'down'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
              <div className="flex items-center mt-2">
                {card.trend === 'up' ? (
                  <TrendingUp className="text-green-500" size={16} />
                ) : (
                  <TrendingDown className="text-red-500" size={16} />
                )}
                <span className={`text-sm font-medium ml-1 ${
                  card.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {card.change}
                </span>
                <span className="text-gray-400 text-sm ml-1">vs mes anterior</span>
              </div>
            </div>
            <div className={`${card.color} p-3 rounded-full`}>
              <card.icon className="text-white" size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;