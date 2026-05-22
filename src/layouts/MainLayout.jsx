import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

function MainLayout() {
  return (
    <div className="flex min-h-screen">
      
      <Sidebar />

      <div className="flex-1 ml-64">
        <TopBar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

export default MainLayout;