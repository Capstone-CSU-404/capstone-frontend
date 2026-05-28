import { User, LayoutDashboard, LogOut, X } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../services/firebase"

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: User, label: "Profile", path: "/profile" },
]

// Menerima props dari MainLayout
function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      navigate("/login")
    } catch (error) {
      console.error("Logout Error:", error)
    }
  }

  return (
    <>
      {/* OVERLAY MOBILE: Hanya muncul di HP saat sidebar terbuka */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR PANEL */}
      <aside
        className={cn(
          `
          fixed top-0 left-0 z-50
          h-screen w-64
          bg-slate-950
          flex flex-col py-8
          transition-all duration-300
          `,
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* TOMBOL CLOSE KHUSUS HP */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white md:hidden p-2 rounded-lg hover:bg-slate-900"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LOGO */}
        <div className="px-8 mb-12 mt-6 md:mt-10">
          <h1 className="text-xl font-black text-indigo-500">SkillsGap</h1>
          <p className="text-[10px] tracking-[0.2em] uppercase text-slate-500 mt-1">
            AI Career Navigator
          </p>
        </div>

        {/* MENU */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsOpen(false)
                }
              }}
              className={({ isActive }) =>
                cn(
                  `
                  flex items-center
                  space-x-4
                  px-6 py-3
                  text-slate-400
                  hover:text-indigo-400
                  hover:bg-slate-900
                  transition-all
                  `,
                  isActive &&
                    `
                    bg-slate-900
                    text-indigo-400
                    rounded-r-full
                    font-bold
                    `
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="tracking-wide text-xs uppercase">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="mt-auto border-t border-slate-800 pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 px-6 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="tracking-wide text-xs uppercase">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar