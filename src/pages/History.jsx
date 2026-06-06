import React, { useState, useEffect } from "react";
import { Clock, Briefcase, Calendar, Loader2, AlertCircle, Eye, Star, CheckCircle } from "lucide-react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"; // 👈 Headless UI Imports
import api from "../services/api";

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // State pelacak target pembelajaran skill aktif
  const [starredSkillsList, setStarredSkillsList] = useState([]);

  // State Pengontrol Modal Headless UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // 1. Ambil Data History & Target Pathway secara Paralel
  // 1. PERBAIKAN FETCH DATA: Memastikan Token Terlampir Sempurna
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userData = storedUser?.data?.user || storedUser?.user || storedUser;
      setUser(userData);

      if (!userData?.uid) {
        setError("User ID tidak ditemukan. Silakan login kembali.");
        setIsLoading(false);
        return;
      }

      // 💡 AMBIL TOKEN DARI LOCALSTORAGE SECARA MANUAL UNTUK ANTISIPASI INTERCEPTOR DELAY
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      // Ambil data history kemajuan analisis dan list target pathway secara paralel
      const [historyResponse, pathwayResponse] = await Promise.all([
        api.get(`/history/progress/${userData.uid}`, config),
        api.get(`/pathway/${userData.uid}`, config).catch(() => ({ data: [] }))
      ]);

      // Set data history tracker ke state
      const actualArray = historyResponse.data?.data || [];
      setHistoryData([...actualArray].reverse());

      const starredData = Array.isArray(pathwayResponse.data)
        ? pathwayResponse.data
        : (pathwayResponse.data?.data || []);

      // Normalisasi teks ke huruf kecil untuk menghindari case-sensitivity duplikasi
      setStarredSkillsList(
        starredData.map(item => item.skill_name ? item.skill_name.toLowerCase().trim() : "")
      );

    } catch (err) {
      console.error("Gagal memuat data di History Page:", err);
      // Jika terdeteksi 401, beri pesan edukatif ke user
      if (err.response?.status === 401) {
        setError("Sesi Anda telah berakhir (401). Silakan log out lalu login kembali agar token diperbarui.");
      } else {
        setError("Gagal memuat riwayat analisis dari server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Fungsi Kirim Target Skill Baru ke Backend Pathway
  // 2. PERBAIKAN POST PATHWAY: Penyesuaian Payload dengan Aturan Baru Middleware Backend
  const handleStarSkill = async (skillName, targetRole) => {
    if (!user?.uid) return;

    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      // 💡 ADJUST PAYLOAD: Kirim struktur bersih. Sesuai middleware baru, 
      // Backend akan membaca UID langsung dari Token JWT, jadi userId di body bersifat opsional/dihapus jika memicu 400.
      const payload = {
        user_id: user.uid, // Tetap dikirim sebagai fallback
        skill_name: skillName,
        target_role: targetRole, // Jika backend memakai role_name, ganti key ini menjadi: role_name: targetRole
        status: "learning"
      };

      const response = await api.post("/pathway", payload, config);

      if (response.status === 200 || response.status === 201) {
        // Daftarkan langsung ke state lokal agar UI beralih ke status 'Tracked'
        setStarredSkillsList(prev => [...prev, skillName.toLowerCase().trim()]);
      }
    } catch (err) {
      console.error("Gagal menambahkan target skill ke pathway:", err);

      // Tampilkan detail pesan dari backend agar kamu tahu field mana yang ditolak validasi
      const backendErrorMessage = err.response?.data?.message || "Skill ini gagal ditambahkan.";
      alert(`Error 400: ${backendErrorMessage}`);
    }
  };

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

  const openDetailModal = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
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
          Daftar rekam jejak rekomendasi posisi serta pemetaan kompetensi gap skill dari AI.
        </p>
      </div>

      {/* CORE CONTENT */}
      {isLoading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 bg-slate-50/50 rounded-2xl border border-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm text-slate-500 font-medium">Memuat data riwayat...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      ) : historyData.length > 0 ? (
        <div className="space-y-4">
          {historyData.map((session, index) => {
            const roleName = session.role || "Unknown Role";
            const percentage = session.score || 0;
            const rawDate = session.date;

            return (
              <div
                key={session.id || index}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-base text-slate-800 truncate">
                      {roleName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Dianalisis pada: {rawDate ? formatTimestamp(rawDate) : "-"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-50">
                  <span className="text-sm font-bold px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/70 shrink-0">
                    {percentage}% Match
                  </span>

                  <button
                    onClick={() => openDetailModal(session)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-950 text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition-all shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detail Skills</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Belum Ada Riwayat</h3>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 🛠️ MODAL HEADLESS UI INTEGRATED FOR SKILL GAP ANALYSIS                  */}
      {/* ======================================================================= */}
      <Dialog open={isModalOpen} onClose={setIsModalOpen} className="relative z-50">
        {/* Backdrop overlay gelap halus */}
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              {/* Header & Body Konten */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start w-full">
                  <div className="w-full text-center sm:text-left">
                    <DialogTitle as="h3" className="text-base font-extrabold text-slate-900 flex flex-col">
                      <span>Rekomendasi Kompetensi Skill</span>
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit">
                        Target: {selectedSession?.role || "Unknown"}
                      </span>
                    </DialogTitle>

                    <div className="mt-4 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {(() => {
                        if (!selectedSession) return null;

                        // 1. Tentukan dataset array skill secara dinamis sesuai porsi role
                        let skillsArray = selectedSession.skills_to_learn || selectedSession.missing_skills || [];

                        if (skillsArray.length === 0) {
                          const currentRole = (selectedSession.role || "").toLowerCase();
                          if (currentRole.includes("backend")) {
                            skillsArray = ["MYSQL", "DOCKER", "GOLANG", "KAFKA", "MICROSERVICES"];
                          } else if (currentRole.includes("data scientist")) {
                            skillsArray = ["Python", "TensorFlow", "Keras", "SQL", "Scikit-Learn"];
                          } else if (currentRole.includes("fullstack")) {
                            skillsArray = ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"];
                          } else {
                            skillsArray = ["Git", "RESTful API", "Agile Methodologies"];
                          }
                        }

                        const maxItems = selectedSession.missing_skills_count || skillsArray.length;
                        const finalSkillsToShow = skillsArray.slice(0, maxItems);

                        return finalSkillsToShow.map((skill, sIdx) => {
                          const cleanSkillName = skill.trim().toLowerCase();
                          const isAlreadyStarred = starredSkillsList.includes(cleanSkillName);

                          return (
                            <div
                              key={sIdx}
                              className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl"
                            >
                              <span className="font-bold text-sm text-slate-800">{skill}</span>

                              <button
                                disabled={isAlreadyStarred}
                                onClick={() => handleStarSkill(skill, selectedSession.role)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${isAlreadyStarred
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-not-allowed"
                                    : "bg-white text-amber-600 border-amber-200 hover:bg-amber-50"
                                  }`}
                              >
                                {isAlreadyStarred ? (
                                  <>
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-current" />
                                    <span>Tracked</span>
                                  </>
                                ) : (
                                  <>
                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                                    <span>Add Track</span>
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex w-full justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 sm:w-auto"
                >
                  Selesai
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default History;