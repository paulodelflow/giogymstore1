import { useState } from "react";
import { Button } from "../ui/button";
import { Package, ChevronUp, ChevronDown, Users, Dumbbell, Box, Store, Bug, X } from "lucide-react";
import { Link } from 'react-router-dom'; // Importar Link de react-router-dom

export default function DashboardSidebar({ sidebarOpen, toggleSidebar }) {
  const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);
  const [isInventoryMenuOpen, setIsInventoryMenuOpen] = useState(false);
  const [isRackMenuOpen, setIsRackMenuOpen] = useState(false);
  const [isBodegaMenuOpen, setIsBodegaMenuOpen] = useState(false);
  const [isTiendaMenuOpen, setIsTiendaMenuOpen] = useState(false);
  const [isBugsMenuOpen, setIsBugsMenuOpen] = useState(false);
  const [isDuenosMenuOpen, setIsDuenosMenuOpen] = useState(false); // Nuevo estado para el menú de dueños

  const toggleUsersMenu = () => setIsUsersMenuOpen(!isUsersMenuOpen);
  const toggleInventoryMenu = () => setIsInventoryMenuOpen(!isInventoryMenuOpen);
  const toggleRackMenu = () => setIsRackMenuOpen(!isRackMenuOpen);
  const toggleBodegaMenu = () => setIsBodegaMenuOpen(!isBodegaMenuOpen);
  const toggleTiendaMenu = () => setIsTiendaMenuOpen(!isTiendaMenuOpen);
  const toggleBugsMenu = () => setIsBugsMenuOpen(!isBugsMenuOpen);
  const toggleDuenosMenu = () => setIsDuenosMenuOpen(!isDuenosMenuOpen); // Función para abrir/cerrar el submenú de dueños

  return (
    <aside
      className={`bg-white w-64 md:w-64 md:flex-shrink-0 md:flex md:flex-col p-4 transition-all duration-300 ease-in-out
      fixed left-0 top-0 bottom-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Dumbbell className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold">BioGymStore</span> 
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <nav className="space-y-2 overflow-y-auto">
        {/* Inventario */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleInventoryMenu}
          >
            <Package className="mr-2 h-4 w-4" /> Inventario
            {isInventoryMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isInventoryMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Link to="/Agregar-Producto" className="w-full block">
              <Button variant="ghost" className="w-full justify-start">Crear Producto</Button>
              </Link>
              
              <Link to="/ver-Producto" className="w-full block">
              <Button variant="ghost" className="w-full justify-start">Ver Productos</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start">Modificar Producto</Button>
            </div>
          )}
        </div>

        {/* Cuentas */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleUsersMenu}
          >
            <Users className="mr-2 h-4 w-4" /> Cuentas
            {isUsersMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isUsersMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              
              <Link to="/Crear-users" className="w-full block">
              <Button variant="ghost" className="w-full justify-start">Crear Usuario</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start">Ver Usuarios</Button>
              <Button variant="ghost" className="w-full justify-start">Modificar Usuario</Button>
            </div>
          )}
        </div>
        {/* Racks */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleRackMenu}
          >
            <Package className="mr-2 h-4 w-4" /> Racks
            {isRackMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isRackMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Link to="/crear-rack" className="w-full block">
              <Button variant="ghost" className="w-full justify-start">Crear Rack</Button>
              </Link>
              <Link to="/Qr-Crear" className="w-full block">
              <Button variant="ghost" className="w-full justify-start">Imprimir QR</Button>
              </Link>
              <Link to="/Ver-rack" className="w-full block">
              <Button variant="ghost" className="w-full justify-start">Ver Racks</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Bodega */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleBodegaMenu}
          >
            <Box className="mr-2 h-4 w-4" /> Bodega
            {isBodegaMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isBodegaMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Link to="/crear-bodega" className="w-full block">
              <Button variant="ghost" className="w-full justify-start">Crear Bodega</Button>
              </Link>
              <Link to="/ver-bodegas" className="w-full block">
              <Button variant="ghost" className="w-full justify-start">Ver Bodega</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start">Modificar Bodega</Button>
            </div>
          )}
        </div>

        {/* Tienda */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleTiendaMenu}
          >
            <Store className="mr-2 h-4 w-4" /> Tienda
            {isTiendaMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isTiendaMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Link to="/crear-tienda" className="w-full block">
                <Button variant="ghost" className="w-full justify-start">Crear Tienda</Button>
              </Link>
              <Link to="/ver-tienda" className="w-full block">
                <Button variant="ghost" className="w-full justify-start">Ver Tienda</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start">Modificar Tienda</Button>
            </div>
          )}
        </div>

        {/* Bugs */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleBugsMenu}
          >
            <Bug className="mr-2 h-4 w-4" /> Bugs
            {isBugsMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isBugsMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Button variant="ghost" className="w-full justify-start">Crear Comentario</Button>
              <Button variant="ghost" className="w-full justify-start">Ver Bugs</Button>
            </div>
          )}
        </div>

        {/* Dueños */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleDuenosMenu}
          >
            <Users className="mr-2 h-4 w-4" /> Dueños
            {isDuenosMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isDuenosMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Link to="/crear-dueño" className="w-full block">
              <Button variant="ghost" className="w-full justify-start">Crear Dueño</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start">Ver Dueños</Button>
              <Button variant="ghost" className="w-full justify-start">Modificar Dueño</Button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
