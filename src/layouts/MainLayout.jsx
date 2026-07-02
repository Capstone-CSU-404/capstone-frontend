import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"

function MainLayout() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`
          flex-1
          w-full
          transition-all
          duration-300
          ease-in-out
          ${isOpen ? "md:pl-64" : "md:pl-0"}
        `}
      >
        <TopBar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout