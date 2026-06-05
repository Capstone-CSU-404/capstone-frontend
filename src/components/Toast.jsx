function Toast({ toast, setToast }) {
  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 transform ${
        toast.show
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-4 opacity-0 scale-95 pointer-events-none"
      } ${
        toast.type === "success"
          ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
          : "bg-rose-50/90 border-rose-200 text-rose-800"
      }`}
    >
      {toast.type === "success" ? (
        <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm animate-bounce">
          ✓
        </div>
      ) : (
        <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
          ✕
        </div>
      )}

      <div className="flex flex-col">
        <span className="text-xs font-bold tracking-wide uppercase opacity-60">
          {toast.type === "success" ? "System Success" : "System Error"}
        </span>
        <p className="text-sm font-semibold mt-0.5">{toast.message}</p>
      </div>

      <button
        onClick={() => setToast({ ...toast, show: false })}
        className="ml-3 text-slate-400 hover:text-slate-600 font-medium text-sm p-1 rounded-md transition-colors"
      >
        ✕
      </button>
    </div>
  )
}

export default Toast