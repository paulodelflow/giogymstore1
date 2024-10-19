import React, { useState, useEffect } from "react";
import { Input } from "../../../ui/Input";
import { Button } from "../../../ui/button";
import { db } from "../../../../libs/firebase"; // Importamos Firestore
import { collection, addDoc, getDocs } from "firebase/firestore"; // Para interactuar con Firestore
import DashboardHeader from "../../../menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../../../menu/DashboardSidebar"; // Importar el sidebar del dashboard
import { toast } from "react-toastify"; // Importar el toast
import 'react-toastify/dist/ReactToastify.css'; // Importa el CSS de react-toastify

export default function CrearRack() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    codRack: "",
    numRack: "",
    fila: "",
    pasillo: "", // Añadimos el campo de pasillo
    codBodega: "", // Código de la bodega
    nomBodega: "", // Nombre de la bodega para mostrarlo
  });
  const [loading, setLoading] = useState(false);
  const [bodegas, setBodegas] = useState([]); // Lista de bodegas para seleccionar
  const [loadingBodegas, setLoadingBodegas] = useState(true); // Estado para manejar la carga de bodegas

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Cargar bodegas desde Firestore
  useEffect(() => {
    const fetchBodegas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bodegas"));
        const bodegasList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          codBodega: doc.data().codBodega,
          nomBodega: doc.data().nomBodega,
        }));
        setBodegas(bodegasList);
        setLoadingBodegas(false);
      } catch (error) {
        toast.error("Error al cargar bodegas: " + error.message);
        setLoadingBodegas(false);
      }
    };

    fetchBodegas();
  }, []);

  // Generar un código de rack único automáticamente
  useEffect(() => {
    const generateCodRack = () => {
      const codRack = `RACK-${Date.now()}`; // Generar un código único basado en la fecha actual
      setFormData((prevData) => ({
        ...prevData,
        codRack,
      }));
    };

    generateCodRack();
  }, []); // Se ejecuta solo una vez para generar el código al montar el componente

  // Manejador general para actualizar los campos del formulario
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Función para manejar el cambio de selección de bodega
  const handleBodegaChange = (e) => {
    const selectedBodegaCod = e.target.value;
    const selectedBodega = bodegas.find((bodega) => bodega.codBodega === selectedBodegaCod);
    setFormData({
      ...formData,
      codBodega: selectedBodega ? selectedBodega.codBodega : "",
      nomBodega: selectedBodega ? selectedBodega.nomBodega : "",
    });
  };

  // Validación del formulario
  const validateForm = () => {
    const { numRack, fila, pasillo, codBodega } = formData;
    if (!numRack.trim()) {
      toast.error("El número de rack es obligatorio.");
      return false;
    }
    if (!fila.trim()) {
      toast.error("La fila es obligatoria.");
      return false;
    }
    if (!pasillo.trim()) {
      toast.error("El pasillo es obligatorio.");
      return false;
    }
    if (!codBodega) {
      toast.error("Debe seleccionar una bodega.");
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

    const { codRack, numRack, fila, pasillo, codBodega } = formData;

    try {
      // Agregar los datos del rack a Firestore
      await addDoc(collection(db, "racks"), {
        codRack, // Código único del rack
        numRack,
        fila,
        pasillo, // Incluir el pasillo en los datos
        codBodega, // Guardamos la bodega a la que pertenece el rack
      });

      toast.success("Rack creado exitosamente");

      // Limpiar el formulario
      setFormData({
        codRack: `RACK-${Date.now()}`, // Genera un nuevo código para el próximo rack
        numRack: "",
        fila: "",
        pasillo: "",
        codBodega: "",
        nomBodega: "",
      });
    } catch (err) {
      console.error("Error al agregar el rack a Firestore:", err);
      toast.error("Error al crear el rack: " + err.message);
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

        {/* Contenido Principal - Formulario para Crear Rack */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Crear Rack</h1>

            {loadingBodegas ? (
              <p>Cargando bodegas...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Número del rack */}
                <div className="mb-4">
                  <label htmlFor="numRack" className="block text-sm font-medium text-gray-700">
                    Número de Rack
                  </label>
                  <Input
                    id="numRack"
                    type="text"
                    placeholder="Número de Rack"
                    value={formData.numRack}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>

                {/* Fila */}
                <div className="mb-4">
                  <label htmlFor="fila" className="block text-sm font-medium text-gray-700">
                    Fila
                  </label>
                  <Input
                    id="fila"
                    type="text"
                    placeholder="Fila"
                    value={formData.fila}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>

                {/* Pasillo */}
                <div className="mb-4">
                  <label htmlFor="pasillo" className="block text-sm font-medium text-gray-700">
                    Pasillo
                  </label>
                  <Input
                    id="pasillo"
                    type="text"
                    placeholder="Pasillo"
                    value={formData.pasillo}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>

                {/* Selección de la bodega */}
                <div className="mb-4">
                  <label htmlFor="codBodega" className="block text-sm font-medium text-gray-700">
                    Seleccionar Bodega
                  </label>
                  <select
                    id="codBodega"
                    value={formData.codBodega}
                    onChange={handleBodegaChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Seleccione una bodega</option>
                    {bodegas.map((bodega) => (
                      <option key={bodega.codBodega} value={bodega.codBodega}>
                        {bodega.nomBodega}
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
                    {loading ? "Creando rack..." : "Crear Rack"}
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
