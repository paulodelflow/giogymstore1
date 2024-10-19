import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { db } from "../../libs/firebase"; // Importamos Firestore
import { collection, addDoc } from "firebase/firestore"; // Para interactuar con Firestore
import DashboardHeader from "../menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../menu/DashboardSidebar"; // Importar el sidebar del dashboard

export default function CrearDueno() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nombreDueno, setNombreDueno] = useState("");
  const [correoDueno, setCorreoDueno] = useState("");
  const [nombreTienda, setNombreTienda] = useState("");
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
    if (!nombreDueno || !correoDueno || !nombreTienda) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      // Agregar los datos del dueño a Firestore
      await addDoc(collection(db, "duenos"), {
        nombreDueno,
        correoDueno,
        nombreTienda,
        fechaCreacion: new Date(), // Añadir fecha de creación
      });

      // Si el dueño se creó con éxito
      setSuccess(true);
      setNombreDueno(""); // Limpiar los campos
      setCorreoDueno("");
      setNombreTienda("");
    } catch (err) {
      // Si ocurre un error
      setError("Error al crear el dueño: " + err.message);
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

        {/* Contenido Principal - Formulario para Crear Dueño */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Crear Dueño</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">Dueño creado exitosamente</div>}
            
            <form onSubmit={handleSubmit}>
              {/* Nombre del Dueño */}
              <div className="mb-4">
                <label htmlFor="nombreDueno" className="block text-sm font-medium text-gray-700">
                  Nombre del Dueño
                </label>
                <Input
                  id="nombreDueno"
                  type="text"
                  placeholder="Nombre del dueño"
                  value={nombreDueno}
                  onChange={(e) => setNombreDueno(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {/* Correo del Dueño */}
              <div className="mb-4">
                <label htmlFor="correoDueno" className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <Input
                  id="correoDueno"
                  type="email"
                  placeholder="Correo electrónico"
                  value={correoDueno}
                  onChange={(e) => setCorreoDueno(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {/* Nombre de la Tienda */}
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

              {/* Botón de crear */}
              <div className="mb-4">
                <Button type="submit" className="w-full bg-blue-500 text-white" disabled={loading}>
                  {loading ? "Creando dueño..." : "Crear Dueño"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
