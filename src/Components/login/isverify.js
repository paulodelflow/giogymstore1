import React, { useEffect, useState } from 'react';
import { applyActionCode, getAuth } from 'firebase/auth';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/Authcontext'; // Importar el AuthContext
import { updateDoc, doc, getDoc } from 'firebase/firestore'; // Para actualizar el campo 'isVerified' en Firestore
import { db } from '../../libs/firebase'; // Configuración de Firestore

export default function VerificacionEmail() {
  const [verifying, setVerifying] = useState(true); // Estado para saber si se está verificando el email
  const [storeName, setStoreName] = useState(''); // Estado para almacenar el nombre de la tienda
  const [userRole, setUserRole] = useState(''); // Estado para almacenar el rol del usuario
  const [userName, setUserName] = useState(''); // Estado para almacenar el nombre del usuario
  const [searchParams] = useSearchParams(); // Hook para obtener los parámetros de la URL
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Obtener el usuario actual del contexto de autenticación

  const auth = getAuth();

  useEffect(() => {
    const oobCode = searchParams.get('oobCode'); // Obtener el oobCode de la URL
    console.log('oobCode:', oobCode); // Depuración para ver si se obtiene el oobCode

    if (oobCode) {
      applyActionCode(auth, oobCode)
        .then(async () => {
          toast.success('Correo verificado con éxito.');

          // Si el usuario está autenticado, actualizamos en Firestore el campo `isVerified`
          if (currentUser) {
            try {
              await updateDoc(doc(db, 'users', currentUser.uid), {
                isVerified: true,
              });

              // Obtener información adicional del usuario (nombre, tienda, rol)
              const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserName(userData.name); // Guardar el nombre del usuario
                setUserRole(userData.role); // Guardar el rol del usuario
                const storeId = userData.store;

                // Obtener el nombre de la tienda
                const storeDoc = await getDoc(doc(db, 'stores', storeId));
                if (storeDoc.exists()) {
                  const storeData = storeDoc.data();
                  setStoreName(storeData.nombreTienda); // Guardar el nombre de la tienda en el estado
                } else {
                  toast.error('No se encontró la tienda en Firestore.');
                }
              } else {
                toast.error('No se encontraron datos del usuario en Firestore.');
              }
            } catch (error) {
              console.error('Error actualizando el estado de verificación en Firestore:', error);
              toast.error('Error actualizando el estado de verificación en Firestore.');
            }
          }

          setVerifying(false); // Finalizar la verificación
        })
        .catch((error) => {
          console.error('Error al verificar el correo:', error);
          if (error.code === 'auth/invalid-action-code') {
            toast.error('El código de verificación es inválido o ya ha sido usado. Solicita un nuevo enlace.');
          } else {
            toast.error('Error al verificar el correo. Inténtalo de nuevo.');
          }
          setVerifying(false);
        });
    } else {
      toast.error('No se encontró el código de verificación.');
      setVerifying(false);
    }
  }, [auth, navigate, searchParams, currentUser]);

  const handleLogin = () => {
    navigate('/'); // Redirigir a la página de login
  };

  if (verifying) {
    return <p className="text-center text-lg">Verificando tu correo...</p>; // Mostrar mensaje mientras se verifica
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        {currentUser ? (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">¡Correo verificado!</h2>
            <p className="mb-4 text-center">
              Hola <strong>{userName || 'Usuario'}</strong>, tu cuenta de <strong>{storeName}</strong> ha sido activada correctamente con el rol de <strong>{userRole}</strong>.
            </p>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Login
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Verificación completada</h2>
            <p className="mb-4 text-center">Por favor, inicia sesión para continuar.</p>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
