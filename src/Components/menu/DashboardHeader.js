import { useState } from "react";
import { Button } from "../ui/button";
import { Bell, Menu, User, Settings, LogOut } from "lucide-react";
import { useAuth } from '../../Context/Authcontext'; // Hook de autenticación para cerrar sesión

export default function DashboardHeader({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuth(); // Usar el hook de autenticación

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = async () => {
    try {
      await logout(); // Llamada para cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">BioGymStore</h1>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Dropdown de usuario */}
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={toggleDropdown}>
              <User className="h-5 w-5" />
            </Button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-20">
                <div className="px-4 py-2 text-sm font-medium text-gray-700">Mi Cuenta</div>
                <div className="border-t border-gray-200"></div>
                <div
                  className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => console.log('Configuración seleccionada')}
                >
                  <Settings className="mr-2 h-4 w-4" /> Configuración
                </div>
                <div
                  className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={handleLogout} // Función para cerrar sesión
                >
                  <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
