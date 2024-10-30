import React, { useEffect, useState } from "react";
import { db } from '../../../../libs/firebase'; // Importar Firestore
import { collection, getDocs } from 'firebase/firestore'; // Métodos de Firestore
import DashboardHeader from "../../../menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../../../menu/DashboardSidebar"; // Importar el sidebar del dashboard
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VerProductos() {
  const [productos, setProductos] = useState([]); // Estado para almacenar los productos
  const [racks, setRacks] = useState([]); // Estado para almacenar los racks
  const [bodegas, setBodegas] = useState([]); // Estado para almacenar las bodegas
  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado para el sidebar
  const [loading, setLoading] = useState(true); // Estado para saber si está cargando
  const [expandedProduct, setExpandedProduct] = useState(null); // Estado para manejar el producto expandido
  const [selectedImage, setSelectedImage] = useState(null); // Estado para la imagen seleccionada
  const [searchQuery, setSearchQuery] = useState(''); // Estado para manejar el valor de búsqueda

  // Función para obtener los productos de Firestore
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const productosSnapshot = await getDocs(collection(db, 'productos'));
      const productosList = productosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProductos(productosList);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los productos: ", error);
      toast.error("Error al obtener los productos.");
      setLoading(false);
    }
  };

  // Función para obtener los racks de Firestore
  const fetchRacks = async () => {
    setLoading(true);
    try {
      const racksSnapshot = await getDocs(collection(db, 'racks'));
      const racksList = racksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRacks(racksList);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los racks: ", error);
      toast.error("Error al obtener los racks.");
      setLoading(false);
    }
  };

  // Función para obtener las bodegas de Firestore
  const fetchBodegas = async () => {
    setLoading(true);
    try {
      const bodegasSnapshot = await getDocs(collection(db, 'bodegas'));
      const bodegasList = bodegasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBodegas(bodegasList);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener las bodegas: ", error);
      toast.error("Error al obtener las bodegas.");
      setLoading(false);
    }
  };

  // useEffect para cargar los productos, racks y bodegas cuando se monte el componente
  useEffect(() => {
    fetchProductos();
    fetchRacks();
    fetchBodegas();
  }, []);

  // Función para manejar el clic en "Ver más"
  const toggleExpand = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  // Función para cerrar la imagen seleccionada
  const closeImage = () => {
    setSelectedImage(null);
  };

  // Función para manejar la búsqueda
  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Filtrar productos según la búsqueda por SKU o nombre
  const filteredProductos = productos.filter(producto =>
    producto.sku.toLowerCase().includes(searchQuery) || 
    producto.nombreProducto.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="w-full p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Lista de Productos</h1>

            {/* Barra de búsqueda */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar por SKU o Nombre del Producto"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {loading ? (
              <p>Cargando productos...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="py-3 px-6 border-b text-left font-semibold text-sm">SKU</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-sm">Nombre del Producto</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-sm">Rack</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-sm">Fila</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-sm">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProductos.map((producto) => {
                      // Buscamos el número del rack (numRack) y la fila asociado al código del rack en productos
                      const rack = racks.find(rack => rack.codRack === producto.rack);
                      const numRack = rack ? rack.numRack : "Rack no encontrado";
                      const fila = rack ? rack.fila : "Fila no encontrada";
                      const pasillo = rack && rack.pasillo ? rack.pasillo : "Sin pasillo";

                      // Buscar la bodega correspondiente al codBodega del rack
                      const bodega = rack ? bodegas.find(b => b.codBodega === rack.codBodega) : null;
                      const nombreBodega = bodega ? bodega.nomBodega : "Bodega no encontrada";

                      const isExpanded = expandedProduct === producto.id;

                      return (
                        <React.Fragment key={producto.id}>
                          <tr className="hover:bg-gray-100">
                            <td className="py-3 px-6 border-b text-sm text-gray-700">{producto.sku}</td>
                            <td className="py-3 px-6 border-b text-sm text-gray-700">{producto.nombreProducto}</td>
                            <td className="py-3 px-6 border-b text-sm text-gray-700">{numRack}</td>
                            <td className="py-3 px-6 border-b text-sm text-gray-700">{fila}</td>
                            <td className="py-3 px-6 border-b text-sm text-gray-700">
                              <button
                                onClick={() => toggleExpand(producto.id)}
                                className="text-blue-500 hover:underline"
                              >
                                {isExpanded ? 'Ver menos' : 'Ver más'}
                              </button>
                            </td>
                          </tr>

                          {/* Mostrar detalles adicionales sin animaciones */}
                          {isExpanded && (
                            <tr>
                              <td colSpan="5" className="py-3 px-6 border-b bg-gray-50 text-sm text-gray-700">
                                <div>
                                  <strong>Proveedor:</strong> {producto.proveedor || 'No disponible'}
                                  <br />
                                  <strong>Pasillo:</strong> {pasillo || 'No disponible'}
                                  <br />
                                  <strong>Bodega:</strong> {nombreBodega}
                                  <br />
                                  {producto.fotos && producto.fotos.length > 0 && (
                                    <>
                                      <strong>Fotos:</strong>
                                      <div className="flex gap-2 mt-2">
                                        {producto.fotos.sort().map((foto, index) => (
                                          <img
                                            key={index}
                                            src={foto}
                                            alt={`Foto ${index + 1}`}
                                            className="h-20 w-20 object-cover rounded-md cursor-pointer"
                                            onClick={() => setSelectedImage(foto)} // Hacer clic en la imagen para ampliarla
                                          />
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal para la imagen ampliada */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeImage}
        >
          <img src={selectedImage} alt="Imagen ampliada" className="max-h-full max-w-full" />
        </div>
      )}

      {/* Agregar ToastContainer para mostrar las notificaciones */}
      <ToastContainer />
    </div>
  );
}
