import React, { useState, useEffect } from "react";
import { Clock, Briefcase, ChevronRight, Loader2, Calendar, AlertCircle } from "lucide-react";
import api from "../services/api";

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userData = storedUser?.data?.user || storedUser?.user || storedUser;

        if (!userData?.uid) {
          setError("User ID tidak ditemukan. Silakan login kembali.");
          setIsLoading(false);
          return;
        }

        const response = await api.get(`/history/progress/${userData.uid}`);

        // BACA DARI PROPERTI .data SESUAI CONSOLE LOG
        const actualArray = response.data?.data || [];

        // Balik urutannya (reverse) agar data tanggal terbaru 2026 muncul di paling atas
        setHistoryData([...actualArray].reverse());
      } catch (err) {
        console.error("Gagal memuat riwayat analisis:", err);
        setError("Gagal memuat riwayat analisis dari server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Helper fungsi untuk merapikan format tanggal ISO ke lokal Indonesia
  const formatTimestamp = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }) + " WIB";
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* HEADER PAGE */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-extrabold text-slate-950 flex items-center gap-2 tracking-tight">
          <Clock className="w-6 h-6 text-indigo-500" />
          <span>Riwayat Analisis CV</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Lihat kembali daftar rekomendasi karir (Top Roles) yang pernah kamu generate sebelumnya.
        </p>
      </div>

      {/* STATE LOADING */}
      {isLoading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 bg-slate-50/50 rounded-2xl border border-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm text-slate-500 font-medium">Menghubungkan ke server history...</p>
        </div>
      ) : error ? (
        /* STATE ERROR */
        <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      ) : historyData.length > 0 ? (
        /* STATE DATA BERHASIL TAMPIL */
        <div className="space-y-4">
          {historyData.map((session, index) => {
            // Ambil nilai langsung dari object item sesuai log backend
            const roleName = session.role || "Unknown Role";
            const percentage = session.score || 0;
            const rawDate = session.date;

            return (
              <div
                key={session.id || index}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* Sisi Kiri: Icon & Detail Role */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-base text-slate-800 truncate">
                      {roleName}
                    </h3>
                    {/* Tanggal Analisis */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Dianalisis pada: {rawDate ? formatTimestamp(rawDate) : "-"}</span>
                    </div>
                  </div>
                </div>

                {/* Sisi Kanan: Persentase Match & Informasi Tambahan */}
                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-50">
                  {session.missing_skills_count !== undefined && (
                    <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                      {session.missing_skills_count} Missing Skills
                    </span>
                  )}

                  <span className="text-sm font-bold px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/70 shrink-0">
                    {percentage}% Match
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* STATE DATA KOSONG */
        <div className="text-center py-16 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Belum Ada Riwayat</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Kamu belum pernah melakukan analisis CV di dashboard. Silakan unggah resume kamu terlebih dahulu untuk melihat riwayat di sini.
          </p>
        </div>
      )}
    </div>
  );
}

export default History;