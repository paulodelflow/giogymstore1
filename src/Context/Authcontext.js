import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../libs/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail 
} from 'firebase/auth';
import Swal from 'sweetalert2';

// Crear AuthContext
const AuthContext = createContext();

// Hook personalizado para usar AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// AuthProvider componente
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Monitorizar el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe; // Limpiar suscripción al desmontar
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire('Éxito', 'Inicio de sesión exitoso', 'success');
    } catch (error) {
      // Devolver el error para que el componente llamador lo maneje
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('El correo electrónico no está registrado');
        case 'auth/wrong-password':
          throw new Error('Contraseña incorrecta');
        case 'auth/invalid-email':
          throw new Error('Correo electrónico no válido');
        case 'auth/too-many-requests':
          throw new Error('Demasiados intentos fallidos. Inténtalo más tarde');
        default:
          throw new Error('Error al iniciar sesión: ' + error.message);
      }
    }
  };

  // Función para registrarse
  const register = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Swal.fire('Éxito', 'Registro exitoso', 'success');
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('El correo electrónico ya está registrado');
        case 'auth/invalid-email':
          throw new Error('Correo electrónico no válido');
        case 'auth/weak-password':
          throw new Error('La contraseña es muy débil');
        default:
          throw new Error('Error al registrarse: ' + error.message);
      }
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      Swal.fire('Éxito', 'Has cerrado sesión', 'success');
    } catch (error) {
      throw new Error('Error al cerrar sesión: ' + error.message);
    }
  };

  // Función para restablecer contraseña
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire('Éxito', 'Correo de restablecimiento de contraseña enviado', 'success');
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('El correo electrónico no está registrado');
        case 'auth/invalid-email':
          throw new Error('Correo electrónico no válido');
        default:
          throw new Error('Error al enviar el correo de restablecimiento: ' + error.message);
      }
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
