import React, { useState } from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/button";
import { db } from "../../../firebase"; // Importamos Firestore
import { collection, addDoc } from "firebase/firestore"; // Para interactuar con Firestore
import DashboardHeader from "../../menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../../menu/DashboardSidebar"; // Importar el sidebar del dashboard

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nombreTienda, setNombreTienda] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga de la página
    setLoading(true); // Inicia la carga
    setError(null); // Resetea el error
    setSuccess(false); // Resetea el mensaje de éxito

    // Validación simple para evitar campos vacíos
    if (!nombreTienda || !direccion || !ciudad || !region) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      // Agregar los datos de la tienda a Firestore
      await addDoc(collection(db, "tiendas"), {
        nombreTienda,
        direccion,
        ciudad,
        region,
        fechaCreacion: new Date(), // Añadir fecha de creación
      });

      // Si la tienda se creó con éxito
      setSuccess(true);
      setNombreTienda(""); // Limpiar los campos
      setDireccion("");
      setCiudad("");
      setRegion("");
    } catch (err) {
      // Si ocurre un error
      setError("Error al crear la tienda: " + err.message);
    } finally {
      setLoading(false); // Finaliza el estado de carga
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
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">Tienda creada exitosamente</div>}
            
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
                  value={nombreTienda}
                  onChange={(e) => setNombreTienda(e.target.value)}
                  required
                  className="mt-1"
                />
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
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {/* Ciudad */}
              <div className="mb-4">
                <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">
                  Ciudad
                </label>
                <Input
                  id="ciudad"
                  type="text"
                  placeholder="Ciudad"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {/* Región */}
              <div className="mb-4">
                <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                  Región
                </label>
                <Input
                  id="region"
                  type="text"
                  placeholder="Región"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {/* Botón de crear */}
              <div className="mb-4">
                <Button type="submit" className="w-full bg-blue-500 text-white" disabled={loading}>
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
