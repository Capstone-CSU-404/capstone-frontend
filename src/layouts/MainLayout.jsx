import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"

function MainLayout() {
  // Desktop default terbuka (>= 768px), HP default tertutup
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar menerima status dan fungsi toggle */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Konten Utama: padding kiri berubah dinamis mengikuti status sidebar */}
      <div
        className={`
          flex-1
          w-full
          transition-all
          duration-300
          ${isOpen ? "md:pl-64" : "md:pl-0"}
        `}
      >
        {/* TopBar menerima fungsi toggle untuk tombol hamburger-nya */}
        <TopBar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout