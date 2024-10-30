import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../libs/firebase'; // Your Firestore config
import DashboardHeader from "../../menu/DashboardHeader"; // Your dashboard header component
import DashboardSidebar from "../../menu/DashboardSidebar"; // Your dashboard sidebar component
import { Input } from "../../ui/Input"; // Custom Input component
import { Button } from "../../ui/button"; // Custom Button component
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

export default function AdminCreateUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [name, setName] = useState(''); // New state for the user's name
  const [store, setStore] = useState(''); // New state for store selection
  const [stores, setStores] = useState([]); // List of available stores from Firestore
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // Toggle the sidebar

  // Fetch stores from Firestore
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tiendas")); // Fetching from "tiendas" collection
        const storesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          nombreTienda: doc.data().nombreTienda, // Using "nombreTienda" field
        }));
        setStores(storesList);
      } catch (error) {
        console.error("Error fetching stores:", error);
        toast.error('Error al obtener las tiendas');
      }
    };

    fetchStores();
  }, []);

  // Function to handle creating a new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      toast.success(`Email de verificación enviado a ${email}`);

      // Save the user data in Firestore with their role, name, and associated store
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: name, // Save the user's name
        role: role, // Assigning the role (logística, bodeguero, vendedor)
        store: store, // Saving the associated store
        createdAt: new Date(),
      });

      toast.success(`Usuario creado con éxito. Nombre: ${name}, Rol: ${role}, Tienda: ${store}`);

      // Reset form
      setEmail('');
      setPassword('');
      setRole('');
      setName(''); // Reset the name
      setStore('');
    } catch (error) {
      console.error('Error creando usuario:', error);
      toast.error('Error creando usuario: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Crear Nuevo Usuario</h1>

            <form onSubmit={handleCreateUser}>
              {/* Input for Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nombre del usuario</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ingresa el nombre completo"
                  required
                />
              </div>

              {/* Input for Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email del usuario</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa el email"
                  required
                />
              </div>

              {/* Input for Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                  required
                />
              </div>

              {/* Select Role */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Rol del usuario</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Seleccionar un rol</option>
                  <option value="logistica">Logística</option>
                  <option value="bodeguero">Bodeguero</option>
                  <option value="vendedor">Vendedor</option>
                </select>
              </div>

              {/* Select Store */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tienda Asociada</label>
                <select
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Seleccionar una tienda</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.nombreTienda} {/* Now using "nombreTienda" */}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full" disabled={loading}>
                {loading ? 'Creando Usuario...' : 'Crear Usuario'}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
