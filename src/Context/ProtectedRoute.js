import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Authcontext'; // Hook de autenticación

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth(); // Verifica si el usuario está autenticado

  if (!currentUser) {
    // Si no hay un usuario autenticado, redirige al login
    return <Navigate to="/" />;
  }

  // Si el usuario está autenticado, renderiza los hijos (children)
  return children;
};

export default ProtectedRoute;
