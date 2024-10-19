import React, { useState } from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/button";
import { db } from "../../../libs/firebase"; // Importamos Firestore
import { collection, addDoc } from "firebase/firestore"; // Para interactuar con Firestore
import DashboardHeader from "../../menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../../menu/DashboardSidebar"; // Importar el sidebar del dashboard
import chileRegions from '../../../data/comunas-regiones'; // Importar el archivo JSON de regiones
import { toast } from "react-toastify"; // Importar el toast
import 'react-toastify/dist/ReactToastify.css'; // Importa el CSS de react-toastify si no lo has hecho

export default function CrearTienda() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombreTienda: "",
    direccion: "",
    numeroDireccion: "",
    ciudad: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Función para manejar el cambio de región y actualizar las ciudades (comunas)
  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setFormData({
      ...formData,
      region: selectedRegion,
      ciudad: "", // Limpiar la ciudad seleccionada al cambiar la región
    });
  };

  // Obtener las comunas de la región seleccionada
  const comunas = formData.region
    ? chileRegions.regiones.find((r) => r.region === formData.region)?.comunas || []
    : [];

  // Manejador general para actualizar los campos del formulario
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Validación del formulario
  const validateForm = () => {
    const { nombreTienda, direccion, numeroDireccion, ciudad, region } = formData;

    // Verificar que los campos no estén vacíos
    if (!nombreTienda.trim()) {
      toast.error("El nombre de la tienda es obligatorio.");
      return false;
    }
    if (!region) {
      toast.error("Debe seleccionar una región.");
      return false;
    }
    if (!ciudad) {
      toast.error("Debe seleccionar una ciudad.");
      return false;
    }
    if (!direccion.trim()) {
      toast.error("La dirección es obligatoria.");
      return false;
    }
    if (!numeroDireccion.trim() || !/^[0-9]+$/.test(numeroDireccion)) {
      toast.error("El número de dirección debe ser un número válido.");
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

    const { nombreTienda, direccion, numeroDireccion, ciudad, region } = formData;

    try {
      // Agregar los datos de la tienda a Firestore con un ID automático
      const docRef = await addDoc(collection(db, "tiendas"), {
        nombreTienda,
        direccion: `${direccion} ${numeroDireccion}`,
        ciudad,
        region,
        fechaCreacion: new Date(),
      });

      toast.success(`Tienda creada exitosamente con ID: ${docRef.id}`); // Muestra el ID de la tienda creada

      // Limpiar el formulario
      setFormData({
        nombreTienda: "",
        direccion: "",
        numeroDireccion: "",
        ciudad: "",
        region: "",
      });
    } catch (err) {
      console.error("Error al agregar tienda a Firestore:", err);
      toast.error("Error al crear la tienda: " + err.message); // Toast de error
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

        {/* Contenido Principal - Formulario para Crear Tienda */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Crear Tienda</h1>
            
            <form onSubmit={handleSubmit}>
              {/* Nombre de la tienda */}
              <div className="mb-4">
                <label htmlFor="nombreTienda" className="block text-sm font-medium text-gray-700">
                  Nombre de la Tienda
                </label>
                <Input
                  id="nombreTienda"
                  type="text"
                  placeholder="Nombre de la tienda"
                  value={formData.nombreTienda}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              {/* Región */}
              <div className="mb-4">
                <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                  Región
                </label>
                <select
                  id="region"
                  value={formData.region}
                  onChange={handleRegionChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Seleccione una región</option>
                  {chileRegions.regiones.map((r) => (
                    <option key={r.region} value={r.region}>
                      {r.region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ciudad (Comuna) */}
              <div className="mb-4">
                <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">
                  Ciudad
                </label>
                <select
                  id="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                  disabled={!formData.region} // Desactivar si no se ha seleccionado una región
                >
                  <option value="">Seleccione una ciudad</option>
                  {comunas.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dirección */}
              <div className="mb-4">
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <Input
                  id="direccion"
                  type="text"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              {/* Número de Dirección */}
              <div className="mb-4">
                <label htmlFor="numeroDireccion" className="block text-sm font-medium text-gray-700">
                  Número de Dirección
                </label>
                <Input
                  id="numeroDireccion"
                  type="text"
                  placeholder="Número"
                  value={formData.numeroDireccion}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              {/* Botón de crear */}
              <div className="mb-4">
                <Button
                  type="submit"
                  className="w-full bg-blue-500 text-white"
                  disabled={loading}
                >
                  {loading ? "Creando tienda..." : "Crear Tienda"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
