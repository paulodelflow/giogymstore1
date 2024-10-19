import React, { useState, useEffect } from "react";
import { db } from "../../../../libs/firebase"; // Importar Firestore
import { collection, getDocs } from "firebase/firestore"; // Para interactuar con Firestore
import { QRCodeSVG } from "qrcode.react"; // Componente de QR para React
import { Button } from "../../../ui/button";
import { toast } from "react-toastify"; // Importar el toast
import 'react-toastify/dist/ReactToastify.css'; // Importa el CSS de react-toastify
import DashboardHeader from "../../../menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../../../menu/DashboardSidebar"; // Importar el sidebar del dashboard
import { Card, CardHeader, CardContent, CardTitle } from "../../../ui/Card"; // Usamos el mismo estilo de tarjetas
import { ClipLoader } from "react-spinners"; // Spinner para mostrar mientras carga

export default function GenerarQR() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [racks, setRacks] = useState([]); // Estado para almacenar los racks
  const [bodegas, setBodegas] = useState([]); // Estado para almacenar las bodegas
  const [selectedRacks, setSelectedRacks] = useState([]); // Estado para almacenar los racks seleccionados
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Cargar racks y bodegas desde Firestore
  useEffect(() => {
    const fetchRacksAndBodegas = async () => {
      try {
        const [racksSnapshot, bodegasSnapshot] = await Promise.all([
          getDocs(collection(db, "racks")),
          getDocs(collection(db, "bodegas")),
        ]);

        const racksList = racksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const bodegasList = bodegasSnapshot.docs.map((doc) => ({
          codBodega: doc.data().codBodega,
          nomBodega: doc.data().nomBodega,
        }));

        setRacks(racksList);
        setBodegas(bodegasList);
      } catch (error) {
        toast.error("Error al cargar racks o bodegas: " + error.message);
      } finally {
        setLoading(false); // Deja de mostrar el spinner cuando se cargan los datos
      }
    };

    fetchRacksAndBodegas();
  }, []);

  // Función para obtener el nombre de la bodega dado su código
  const getBodegaName = (codBodega) => {
    const bodega = bodegas.find((b) => b.codBodega === codBodega);
    return bodega ? bodega.nomBodega : "Bodega desconocida"; // Devolver el nombre o un valor predeterminado
  };

  // Manejar la selección de racks
  const handleRackSelection = (rackId) => {
    setSelectedRacks((prevSelected) =>
      prevSelected.includes(rackId)
        ? prevSelected.filter((id) => id !== rackId) // Si ya está seleccionado, lo deseleccionamos
        : [...prevSelected, rackId] // Si no está seleccionado, lo añadimos
    );
  };

  // Función para imprimir los QR seleccionados
  const handlePrintSelectedQR = () => {
    const racksToPrint = racks.filter((rack) => selectedRacks.includes(rack.id));
    const printWindow = window.open("", "PRINT", "height=600,width=800");

    let printContent = `<html><head><title>Imprimir QR</title></head><body>`;

    racksToPrint.forEach((rack) => {
      const bodegaName = getBodegaName(rack.codBodega); // Obtener el nombre de la bodega relacionada
      printContent += `
        <h3>Bodega: ${bodegaName}, Rack: ${rack.numRack || "Sin número"}, Fila: ${rack.fila || "Sin fila"}</h3>
        ${document.getElementById(`qr-${rack.id}`).innerHTML}<br>`;
    });

    printContent += `</body></html>`;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Función para vista previa del QR
  const handlePreviewQR = (rack) => {
    const bodegaName = getBodegaName(rack.codBodega);
    const previewWindow = window.open("", "PREVIEW", "height=600,width=400");

    previewWindow.document.write(`
      <html>
        <head><title>Vista previa del QR</title></head>
        <body>
          <h3>Bodega: ${bodegaName}, Rack: ${rack.numRack}, Fila: ${rack.fila}</h3>
          <div id="qr-preview">
            ${document.getElementById(`qr-${rack.id}`).innerHTML}
          </div>
        </body>
      </html>
    `);

    previewWindow.document.close();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Contenido Principal - Lista de racks con QR */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-7xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Generar Códigos QR para Racks</h1>

            {loading ? (
              <div className="flex justify-center items-center">
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
                <p className="ml-2">Cargando datos...</p>
              </div>
            ) : racks.length === 0 ? (
              <p>No hay racks disponibles.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Lista de racks con selección en tarjetas */}
                {racks.map((rack) => (
                  <Card key={rack.id} className="bg-gray-100 shadow-lg">
                    <CardHeader className="p-4 flex items-center">
                      <input
                        type="checkbox"
                        aria-label={`Seleccionar rack número ${rack.numRack}`}
                        className="mr-2"
                        checked={selectedRacks.includes(rack.id)}
                        onChange={() => handleRackSelection(rack.id)}
                      />
                      <CardTitle className="text-xl font-bold">{`Rack: ${rack.numRack}`}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p><strong>Fila:</strong> {rack.fila}</p>
                      <p><strong>Bodega:</strong> {getBodegaName(rack.codBodega)}</p> {/* Mostrar el nombre de la bodega */}
                      {/* Generación del QR dentro del Card */}
                      <div id={`qr-${rack.id}`}>
                        <QRCodeSVG
                          value={`${rack.codRack}`} // Usar codRack en lugar de codBodega
                          size={100}
                          level={"H"}
                        />
                      </div>
                      {/* Botón de vista previa */}
                      <Button onClick={() => handlePreviewQR(rack)} className="bg-blue-500 text-white mt-2">
                        Vista Previa
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Botón para imprimir los QR seleccionados */}
            {selectedRacks.length > 0 && (
              <div className="mt-6">
                <Button onClick={handlePrintSelectedQR} className="w-full bg-green-500 text-white">
                  Imprimir QR Seleccionados
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
