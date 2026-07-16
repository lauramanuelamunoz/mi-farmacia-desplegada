import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  User,
  Menu,
  X,
  Pill,
  Tag
} from 'lucide-react';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!usuario) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/productos', icon: Pill, label: 'Productos' },
    { path: '/categorias', icon: Tag, label: 'Categorías' },
    { path: '/ventas', icon: ShoppingCart, label: 'Ventas' },
    ...(usuario.rol === 'admin' ? [{ path: '/usuarios', icon: Users, label: 'Usuarios' }] : []),
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">FarmaciaApp</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/perfil"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
            >
              <User size={18} />
              <span className="text-sm">{usuario.nombre}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-red-600 hover:text-red-800"
            >
              <LogOut size={18} />
              <span className="text-sm">Salir</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMenuOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
            <Link
              to="/perfil"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMenuOpen(false)}
            >
              <User size={20} />
              <span>Perfil</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-base font-medium w-full"
            >
              <LogOut size={20} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;