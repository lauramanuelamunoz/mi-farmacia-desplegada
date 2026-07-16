import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Crear el contexto
const AuthContext = createContext();

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const tokenStorage = localStorage.getItem('token');
        const userStorage = localStorage.getItem('usuario');

        if (tokenStorage && userStorage) {
          setToken(tokenStorage);
          setUsuario(JSON.parse(userStorage));
        }
      } catch (error) {
        console.error('Error al cargar usuario del localStorage:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función de login
  const login = (userData, tokenData) => {
    try {
      // Guardar en localStorage
      localStorage.setItem('token', tokenData);
      localStorage.setItem('usuario', JSON.stringify(userData));
      
      // Actualizar estado
      setToken(tokenData);
      setUsuario(userData);
      
      toast.success(`¡Bienvenido ${userData.nombre}!`);
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      toast.error('Error al iniciar sesión');
      return false;
    }
  };

  // Función de logout
  const logout = () => {
    try {
      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      
      // Limpiar estado
      setToken(null);
      setUsuario(null);
      
      toast.success('Sesión cerrada correctamente');
      return true;
    } catch (error) {
      console.error('Error en logout:', error);
      toast.error('Error al cerrar sesión');
      return false;
    }
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!token && !!usuario;
  };

  // Verificar si el usuario es administrador
  const isAdmin = () => {
    return usuario?.rol === 'admin';
  };

  // Actualizar datos del usuario
  const updateUser = (userData) => {
    try {
      const updatedUser = { ...usuario, ...userData };
      localStorage.setItem('usuario', JSON.stringify(updatedUser));
      setUsuario(updatedUser);
      toast.success('Datos actualizados correctamente');
      return true;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      toast.error('Error al actualizar datos');
      return false;
    }
  };

  // Obtener token
  const getToken = () => {
    return token || localStorage.getItem('token');
  };

  // Valor del contexto
  const value = {
    usuario,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    isAdmin,
    getToken,
    setUsuario,
    setToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Hook para verificar autenticación en componentes
export const useRequireAuth = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  return { isAuthenticated: isAuthenticated(), loading };
};

// Hook para verificar rol de administrador
export const useRequireAdmin = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin()) {
      toast.error('Acceso denegado. Se requiere rol de administrador');
      navigate('/dashboard');
    }
  }, [loading, isAdmin, navigate]);

  return { isAdmin: isAdmin(), loading };
};

export default AuthContext;