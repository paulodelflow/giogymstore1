import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../libs/firebase"; // Importamos Firestore
import DashboardHeader from "../../menu/DashboardHeader";
import DashboardSidebar from "../../menu/DashboardSidebar";
import { toast } from "react-toastify"; // Importar el toast
import 'react-toastify/dist/ReactToastify.css';

export default function VerBodegas() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bodegas, setBodegas] = useState([]); // Estado para almacenar las bodegas
  const [tiendas, setTiendas] = useState([]); // Estado para almacenar las tiendas
  const [filteredBodegas, setFilteredBodegas] = useState([]); // Estado para bodegas filtradas
  const [loading, setLoading] = useState(true);
  const [selectedTienda, setSelectedTienda] = useState(""); // Filtro por tienda

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Cargar las bodegas y tiendas desde Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener bodegas
        const bodegasSnapshot = await getDocs(query(collection(db, "bodegas"), orderBy("idTienda")));
        const bodegasList = bodegasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Obtener tiendas
        const tiendasSnapshot = await getDocs(collection(db, "tiendas"));
        const tiendasList = tiendasSnapshot.docs.map((doc) => ({
          id: doc.id,
          nombreTienda: doc.data().nombreTienda,
        }));

        setBodegas(bodegasList);
        setTiendas(tiendasList);
        setFilteredBodegas(bodegasList); // Inicialmente todas las bodegas están visibles
        setLoading(false);
      } catch (error) {
        toast.error("Error al cargar los datos: " + error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Aplicar filtro cuando cambia el valor de `selectedTienda`
  useEffect(() => {
    if (selectedTienda) {
      const filtered = bodegas.filter((bodega) => bodega.idTienda === selectedTienda);
      setFilteredBodegas(filtered);
    } else {
      // Si no hay tienda seleccionada, mostrar todas las bodegas
      setFilteredBodegas(bodegas);
    }
  }, [selectedTienda, bodegas]);

  // Manejar cambio en filtro de tienda
  const handleTiendaChange = (e) => {
    setSelectedTienda(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Contenido Principal - Mostrar Bodegas */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Bodegas</h1>

            {loading ? (
              <p>Cargando bodegas...</p>
            ) : (
              <div>
                {/* Filtros */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700">Filtrar por Tienda</label>
                  <select
                    value={selectedTienda}
                    onChange={handleTiendaChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Todas las tiendas</option>
                    {tiendas.map((tienda) => (
                      <option key={tienda.id} value={tienda.id}>
                        {tienda.nombreTienda}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Listado de bodegas filtradas */}
                <ul>
                  {filteredBodegas.map((bodega) => (
                    <li key={bodega.id} className="mb-4">
                      <div className="bg-white shadow p-4 rounded-lg">
                        <h2 className="font-bold text-lg">
                          {bodega.nomBodega}
                        </h2>
                        <p className="text-gray-600">Tienda: {tiendas.find((tienda) => tienda.id === bodega.idTienda)?.nombreTienda || "Tienda no encontrada"}</p>
                        <p className="text-gray-600">
                          {/* Verificar si hay productos registrados */}
                          {bodega.cantidadProductos && bodega.cantidadProductos > 0 
                            ? `Cantidad de productos: ${bodega.cantidadProductos}`
                            : "No hay productos registrados"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
