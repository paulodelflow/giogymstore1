import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/login/Login';
import ResetPasswordForm from './Components/login/resetPassword';
import Dashboard from './Components/all/dashboard';
import CrearTienda from './Components/admin/Tienda/CrearTienda';
import CrearBodega from './Components/admin/Bodega/CrearBodega'; 
import { AuthProvider } from './Context/Authcontext';
import ProtectedRoute from './Context/ProtectedRoute';
import RedirectIfLoggedIn from './Context/RedirectIfLoggedIn';
import VerTiendas from './Components/admin/Tienda/Gettiendas';
import CrearDueño from './Components/duenio/Crear_duenio';
import VerBodegas from './Components/admin/Bodega/VerBodegas'
import CrearRack from './Components/User/Bodeguero/Racks/CrearRacks';
import VerRack from './Components/User/Bodeguero/Racks/VerRacks';
import QrGene from './Components/User/Bodeguero/Racks/ImprimirQr';
import PostProd from './Components/User/Bodeguero/Productos/AgregarProductos';
import GetProd from './Components/User/Bodeguero/Productos/VerProductos'
import CrearUsuario from './Components/admin/users/CrearUser';
import Verificacion from './Components/login/isverify'; // Cambia verif a Verificacion


// Importa ToastContainer de react-toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/*Ruta de Login */}
          <Route 
            path="/" 
            element={
              <RedirectIfLoggedIn>
                <Login />
              </RedirectIfLoggedIn>
            } 
          />
          <Route 
            path="/verificacion" 
            element={
              <RedirectIfLoggedIn>
                <Verificacion /> {/* Usa Verificacion en lugar de verif */}
              </RedirectIfLoggedIn>
            } 
          />



          <Route 
            path="/reset-password" 
            element={
              <RedirectIfLoggedIn>
                <ResetPasswordForm />
              </RedirectIfLoggedIn>
            } 
          />
          {/*Ruta de General */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/*Ruta de tiendas */}
          <Route 
            path="/ver-tienda" 
            element={
              <ProtectedRoute>
                <VerTiendas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/crear-tienda" 
            element={
              <ProtectedRoute>
                <CrearTienda />
              </ProtectedRoute>
            } 
          />
          {/*Ruta de Duenios */}
          <Route 
            path="/crear-dueño" 
            element={
              <ProtectedRoute>
                <CrearDueño />
              </ProtectedRoute>
            } 
          />
          {/*Ruta de bodegas */}
          <Route 
            path="/crear-bodega" 
            element={
              <ProtectedRoute>
                <CrearBodega />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ver-bodegas" 
            element={
              <ProtectedRoute>
                <VerBodegas />
              </ProtectedRoute>
            } 
          />


            {/*Ruta de racks */}
          <Route 
            path="/crear-rack" 
            element={
              <ProtectedRoute>
                <CrearRack />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/QR-Crear" 
            element={
              <ProtectedRoute>
                <QrGene />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Ver-rack" 
            element={
              <ProtectedRoute>
                <VerRack />
              </ProtectedRoute>
            } 
          />

            {/*Ruta de productos */}

            <Route 
            path="/Agregar-Producto" 
            element={
              <ProtectedRoute>
                <PostProd />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/ver-Producto" 
            element={
              <ProtectedRoute>
                <GetProd />
              </ProtectedRoute>
            } 
          />
           {/*Ruta de productos */}

           <Route 
            path="/Crear-users" 
            element={
              <ProtectedRoute>
                <CrearUsuario />
              </ProtectedRoute>
            } 
          />



          </Routes>
        {/* Añadir ToastContainer en la jerarquía */}
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
