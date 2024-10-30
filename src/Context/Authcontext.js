import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../libs/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../libs/firebase'; // Importa la configuración de Firestore
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
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario (nombre, tienda, rol)
  const [loading, setLoading] = useState(true); // Nuevo estado para indicar si los datos se están cargando

  // Monitorizar el estado de autenticación y obtener datos del usuario de Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true); // Iniciar la carga cuando cambia el usuario
      if (user) {
        setCurrentUser(user);
        console.log("UID del usuario autenticado:", user.uid); // <-- Depuración del UID
        try {
          // Obtener los datos adicionales del usuario desde Firestore
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            console.log("Datos del usuario obtenidos:", userSnap.data()); // <-- Depuración de los datos obtenidos
            setUserData(userSnap.data()); // Guardar los datos del usuario (nombre, tienda, rol, etc.)
          } else {
            console.log("No se encontraron datos del usuario en Firestore."); // <-- Depuración si no se encuentra el documento
            setUserData(null); // Asegurarse de que se limpia si no hay datos
          }
        } catch (error) {
          console.error('Error obteniendo los datos del usuario:', error); // <-- Depuración en caso de error
        }
      } else {
        console.log("No hay usuario autenticado."); // <-- Depuración cuando no hay usuario autenticado
        setCurrentUser(null);
        setUserData(null); // Si no hay usuario autenticado, limpiar los datos
      }
      setLoading(false); // Detener la carga después de obtener los datos
    });
    return () => unsubscribe(); // Limpiar suscripción al desmontar
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

  // Función para verificar y actualizar 'isVerified'
  const verifyAccount = async () => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { isVerified: true });
      Swal.fire('Éxito', 'Tu cuenta ha sido verificada correctamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema verificando tu cuenta.', 'error');
    }
  };

  const value = {
    currentUser,
    userData, // Exponer los datos del usuario para usar en otros componentes
    loading, // Estado de carga expuesto para usar en los componentes
    login,
    logout,
    register,
    resetPassword,
    verifyAccount, // Exponer la función para verificar la cuenta
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
