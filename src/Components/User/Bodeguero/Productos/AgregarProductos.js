import React, { useState, useRef } from "react";
import { Button } from "../../../ui/button";
import { QrReader } from '@blackbox-vision/react-qr-reader';
import Webcam from "react-webcam";
import DashboardHeader from "../../../menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../../../menu/DashboardSidebar"; // Importar el sidebar del dashboard
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../../../../libs/firebase'; // Importar Firestore
import { collection, addDoc } from 'firebase/firestore'; // Métodos de Firestore

export default function AgregarProducto() {
  const [formData, setFormData] = useState({
    sku: "",
    nombreProducto: "",
    marca: "",
    rack: "", // El campo "rack" se llenará con el resultado del escaneo QR
    proveedor: "",
    fotos: [], // Fotos capturadas con la cámara
  });

  const [scanning, setScanning] = useState(false);  // Estado para el escáner
  const [qrData, setQrData] = useState("");         // Estado para almacenar el resultado del QR
  const [errorMsg, setErrorMsg] = useState("");     // Estado para mensajes de error
  const [photoError, setPhotoError] = useState(""); // Estado para errores de fotos
  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado para el sidebar

  const webcamRef = useRef(null); // Referencia para la cámara
  const [cameraActive, setCameraActive] = useState(false); // Estado para la cámara

  // Capturar la foto desde la cámara
  const capturePhoto = () => {
    if (!webcamRef.current) return;

    const photoUrl = webcamRef.current.getScreenshot();
    if (formData.fotos.length >= 3) {
      setPhotoError("Máximo 3 fotos permitidas.");
      return;
    }

    setFormData(prevData => ({ ...prevData, fotos: [...prevData.fotos, photoUrl] }));
    setPhotoError(""); // Limpiar cualquier error previo
  };

  // Función para manejar el envío de los datos a Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.sku || !formData.nombreProducto || !formData.marca || !formData.rack || formData.fotos.length === 0) {
      setErrorMsg("Por favor, complete todos los campos y capture al menos una foto.");
      toast.error("Por favor, complete todos los campos y capture al menos una foto.");
      return;
    }

    try {
      // Agregar el producto a Firestore
      await addDoc(collection(db, 'productos'), {
        sku: formData.sku,
        nombreProducto: formData.nombreProducto,
        marca: formData.marca,
        rack: formData.rack,
        proveedor: formData.proveedor,
        fotos: formData.fotos,
      });

      // Mostrar mensaje de éxito
      toast.success('Producto agregado con éxito!');

      // Recargar la página después de agregar el producto
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Esperar 2 segundos para mostrar el toast antes de recargar

    } catch (error) {
      console.error("Error al agregar el producto: ", error);
      toast.error("Error al agregar el producto: " + error.message);
    }
  };

  // Función para manejar el cambio de los inputs de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Agregar Producto</h1>

            {/* Escanear QR */}
            {scanning ? (
              <div className="mb-4">
                <QrReader
                  delay={300}
                  onResult={(result, error) => {
                    if (result) {
                      setQrData(result.text);
                      setFormData(prevData => ({ ...prevData, rack: result.text })); // Preservar el estado actual
                      setScanning(false);
                    }

                    if (error) {
                      if (error.name === "NotFoundException") {
                        setErrorMsg("No se ha detectado un código QR, intenta ajustar la cámara.");
                      } else {
                        setErrorMsg("Error durante el escaneo: " + error.message);
                      }
                    }
                  }}
                  style={{ width: "100%" }}
                  constraints={{ facingMode: "environment" }}
                />
              </div>
            ) : (
              <div className="mb-4">
                <Button
                  type="button"
                  className="w-full bg-blue-500 text-white"
                  onClick={() => {
                    setErrorMsg("");
                    setScanning(true);
                  }}
                >
                  Escanear Código QR o Barras
                </Button>
              </div>
            )}

            {/* Mostrar errores si los hay */}
            {errorMsg && (
              <div className="mb-4">
                <p className="text-red-500">{errorMsg}</p>
              </div>
            )}

            {/* Mostrar el resultado del escaneo */}
            {qrData && (
              <div className="mb-4">
                <p className="text-lg font-medium text-gray-700">Información del Código QR:</p>
                <p className="p-2 mt-2 bg-gray-200 rounded-md">{qrData}</p>
              </div>
            )}

            {/* Campo SKU (ingresado manualmente) */}
            <div className="mb-4">
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                id="sku"
                name="sku"
                type="text"
                value={formData.sku}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Nombre del Producto */}
            <div className="mb-4">
              <label htmlFor="nombreProducto" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
              <input
                id="nombreProducto"
                name="nombreProducto"
                type="text"
                value={formData.nombreProducto}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Marca */}
            <div className="mb-4">
              <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca</label>
              <input
                id="marca"
                name="marca"
                type="text"
                value={formData.marca}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Rack (rellenado por el QR) */}
            <div className="mb-4">
              <label htmlFor="rack" className="block text-sm font-medium text-gray-700">Código del Rack (desde el QR)</label>
              <input
                id="rack"
                name="rack"
                type="text"
                value={formData.rack}
                readOnly
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Cámara para tomar fotos */}
            <div className="mb-4">
              {cameraActive ? (
                <div className="mb-4">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "environment" }} // Cámara trasera
                    className="w-full h-64 bg-black"
                  />
                  <Button type="button" onClick={capturePhoto} className="w-full bg-green-500 text-white mt-4">
                    Tomar Foto
                  </Button>
                </div>
              ) : (
                <div className="mb-4">
                  <Button
                    type="button"
                    onClick={() => setCameraActive(true)}
                    className="w-full bg-blue-500 text-white"
                  >
                    Activar Cámara para Tomar Fotos
                  </Button>
                </div>
              )}
            </div>

            {photoError && <p className="text-red-500">{photoError}</p>}

            {/* Mostrar vista previa de las fotos capturadas */}
            {formData.fotos.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Vista previa de las fotos:</p>
                <div className="flex gap-4">
                  {formData.fotos.map((foto, index) => (
                    <img
                      key={index}
                      src={foto}
                      alt={`Foto ${index + 1}`}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Botón para agregar el producto */}
            <div className="mb-4">
              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-green-500 text-white"
              >
                Agregar Producto
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Agregar ToastContainer para mostrar las notificaciones */}
      <ToastContainer />
    </div>
  );
}
