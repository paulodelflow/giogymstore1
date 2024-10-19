import { useState } from "react";
import DashboardHeader from "../menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../menu/DashboardSidebar"; // Importar el sidebar del dashboard

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);



  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader toggleSidebar={toggleSidebar} />

      </div>
    </div>
  );
}
