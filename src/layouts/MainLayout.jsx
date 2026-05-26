import { Outlet } from "react-router-dom"

import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"

function MainLayout() {

  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      <div
        className="
          w-full
          transition-all
          duration-300
          md:pl-64
        "
      >

        <TopBar />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default MainLayout