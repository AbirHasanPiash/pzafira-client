import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="mb-16">
      <div className="flex justify-center items-center mt-10">
        <h2 className="hidden md:block text-2xl font-bold mb-8">Admin Panel</h2>
      </div>
      <div className="flex justify-center">
        <div className="flex min-h-screen px-6 sm:px-10 md:px-16 max-w-7xl gap-6">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main content */}
          <div className="flex flex-col w-full">
            {/* Hamburger icon for small screens */}
            <div className="flex justify-center items-center">
              <h2 className="block md:hidden text-2xl font-bold mb-8">
                Admin Panel
              </h2>
            </div>
            <div className="md:hidden">
              <button onClick={() => setSidebarOpen(true)}>
                <Menu size={28} />
              </button>
            </div>

            <main className="ml-6 sm:ml-8 md:ml-12">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
