import React, { useState, useEffect } from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/button";
import { db } from "../../../libs/firebase"; // Importamos Firestore
import { collection, addDoc, getDocs } from "firebase/firestore"; // Para interactuar con Firestore
import DashboardHeader from "../../menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../../menu/DashboardSidebar"; // Importar el sidebar del dashboard
import { toast } from "react-toastify"; // Importar el toast
import 'react-toastify/dist/ReactToastify.css'; // Importa el CSS de react-toastify si no lo has hecho

export default function CrearBodega() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    codBodega: "", // Código automático para la bodega
    nomBodega: "",
    idTienda: "",
    nombreTienda: "", // Añadimos el nombre de la tienda
  });
  const [loading, setLoading] = useState(false);
  const [tiendas, setTiendas] = useState([]); // Lista de tiendas para seleccionar
  const [loadingTiendas, setLoadingTiendas] = useState(true); // Estado para manejar la carga de tiendas

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Cargar tiendas desde Firestore para la relación
  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tiendas"));
        const tiendasList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nombreTienda: doc.data().nombreTienda,
        }));
        setTiendas(tiendasList);
        setLoadingTiendas(false);
      } catch (error) {
        toast.error("Error al cargar tiendas: " + error.message);
        setLoadingTiendas(false);
      }
    };

    fetchTiendas();
  }, []);

  // Generar un código de bodega único automáticamente
  useEffect(() => {
    const generateCodBodega = () => {
      const codBodega = `BOD-${Date.now()}`; // Generar un código único basado en la fecha actual
      setFormData((prevData) => ({
        ...prevData,
        codBodega,
      }));
    };

    generateCodBodega();
  }, []); // Se ejecuta solo una vez para generar el código al montar el componente

  // Manejador general para actualizar los campos del formulario
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Función para manejar el cambio de selección de tienda
  const handleTiendaChange = (e) => {
    const selectedTiendaId = e.target.value;
    const selectedTienda = tiendas.find((tienda) => tienda.id === selectedTiendaId);
    setFormData({
      ...formData,
      idTienda: selectedTiendaId, // Guardamos el id de la tienda
      nombreTienda: selectedTienda ? selectedTienda.nombreTienda : "", // Guardamos el nombre de la tienda
    });
  };

  // Validación del formulario
  const validateForm = () => {
    const { nomBodega, idTienda } = formData;
    if (!nomBodega.trim()) {
      toast.error("El nombre de la bodega es obligatorio.");
      return false;
    }
    if (!idTienda) {
      toast.error("Debe seleccionar una tienda.");
      return false;
    }
    return true;
  };

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación antes de enviar el formulario
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const { codBodega, nomBodega, idTienda, nombreTienda } = formData;

    try {
      // Agregar los datos de la bodega a Firestore
      await addDoc(collection(db, "bodegas"), {
        codBodega, // Se guarda en la base de datos, pero no se muestra al usuario
        nomBodega,
        idTienda, // Guardamos el id de la tienda para relaciones futuras
        nombreTienda, // Guardamos el nombre de la tienda para mostrarlo
      });

      toast.success("Bodega creada exitosamente");

      // Limpiar el formulario
      setFormData({
        codBodega: `BOD-${Date.now()}`, // Genera un nuevo código para la próxima bodega
        nomBodega: "",
        idTienda: "",
        nombreTienda: "",
      });
    } catch (err) {
      console.error("Error al agregar la bodega a Firestore:", err);
      toast.error("Error al crear la bodega: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Contenido Principal - Formulario para Crear Bodega */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Crear Bodega</h1>

            {loadingTiendas ? (
              <p>Cargando tiendas...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Nombre de la bodega */}
                <div className="mb-4">
                  <label htmlFor="nomBodega" className="block text-sm font-medium text-gray-700">
                    Nombre de la Bodega
                  </label>
                  <Input
                    id="nomBodega"
                    type="text"
                    placeholder="Nombre de la bodega"
                    value={formData.nomBodega}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>

                {/* Selección de la tienda */}
                <div className="mb-4">
                  <label htmlFor="idTienda" className="block text-sm font-medium text-gray-700">
                    Seleccionar Tienda
                  </label>
                  <select
                    id="idTienda"
                    value={formData.idTienda}
                    onChange={handleTiendaChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Seleccione una tienda</option>
                    {tiendas.map((tienda) => (
                      <option key={tienda.id} value={tienda.id}>
                        {tienda.nombreTienda}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botón de crear */}
                <div className="mb-4">
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 text-white"
                    disabled={loading}
                  >
                    {loading ? "Creando bodega..." : "Crear Bodega"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
