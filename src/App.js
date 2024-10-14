import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/login/Login'; // Ruta al componente Login
import ResetPasswordForm from './Components/login/resetPassword'; // Importa el componente de ResetPassword
import Dashboard from './Components/User/dashboard'; // Importa el componente de Dashboard
import CrearTienda from './Components/admin/Tienda/CrearTienda'; // Importa el componente de CrearTienda
import { AuthProvider } from './Context/Authcontext'; // Proveedor de contexto de autenticación
import ProtectedRoute from './Context/ProtectedRoute'; // Componente para proteger rutas
import RedirectIfLoggedIn from './Context/RedirectIfLoggedIn'; // Componente para redirigir usuarios autenticados

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública: si el usuario está autenticado, redirige al dashboard */}
          <Route 
            path="/" 
            element={
              <RedirectIfLoggedIn>
                <Login /> {/* Muestra el Login solo si no está autenticado */}
              </RedirectIfLoggedIn>
            } 
          />

          {/* Ruta pública: si el usuario está autenticado, redirige al dashboard */}
          <Route 
            path="/reset-password" 
            element={
              <RedirectIfLoggedIn>
                <ResetPasswordForm /> {/* Muestra Reset Password solo si no está autenticado */}
              </RedirectIfLoggedIn>
            } 
          />

          {/* Ruta protegida: Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard /> {/* Renderiza el Dashboard solo si el usuario está autenticado */}
              </ProtectedRoute>
            } 
          />

          {/* Ruta protegida: Crear Tienda */}
          <Route 
            path="/crear-tienda" 
            element={
              <ProtectedRoute>
                <CrearTienda /> {/* Renderiza Crear Tienda solo si el usuario está autenticado */}
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
