import React, { useState, useEffect } from "react";
import { Mail, Code2, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const location = useLocation(); // Untuk memicu render ulang saat pindah halaman
  const [skills, setSkills] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil data lokal dari localStorage tiap kali masuk halaman
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userData = storedUser?.data?.user || storedUser?.user || storedUser;
    setUser(userData);

    const fetchSkillsetData = async () => {
      try {
        setIsLoading(true);
        // 2. HIT ENDPOINT BARU DARI BACKEND
        const response = await api.get("/profile/skillset"); 
        
        // Sesuaikan dengan struktur response JSON backend: response.data.data.skills
        if (response.data && response.data.data && response.data.data.skills) {
          setSkills(response.data.data.skills);
        } else {
          setSkills([]);
        }
      } catch (error) {
        console.error("Gagal memuat data Skillset dari BE:", error);
        setSkills([]); // Amankan dengan array kosong jika request gagal
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkillsetData();
  }, [location]); // Berjalan otomatis setiap kali pindah ke halaman profile

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* HEADER PROFILE */}
      <section className="bg-white rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm border border-slate-100">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={user?.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-50"
            alt="Profile Avatar"
          />
        </div>

        {/* Info Nama & Email */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {user?.name || "User Name"}
          </h2>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-500">
            <Mail className="w-4 h-4 text-indigo-500" /> 
            <span>{user?.email || "loading email..."}</span>
          </div>
        </div>
      </section>

      {/* SKILLS CONTAINER */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-500" />
            <span>Extracted Core Skills</span>
          </h3>
          <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
            Total {skills.length} Skills
          </span>
        </div>

        {/* Loading State Spinner Dalam Section Card */}
        {isLoading ? (
          <div className="min-h-[200px] flex flex-col items-center justify-center gap-2 bg-slate-50/50 rounded-2xl border border-slate-100">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
            <p className="text-xs text-slate-500 font-medium">Fetching skills from server...</p>
          </div>
        ) : (
          /* Grid System */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {skills.length > 0 ? (
              skills.map((skill, i) => {
                const skillName = typeof skill === "object" ? skill.name : skill;
                return (
                  <div 
                    key={i} 
                    className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-200">
                        {skillName.substring(0, 2).toUpperCase()}
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm pt-2 truncate" title={skillName}>
                        {skillName}
                      </h4>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-wider font-medium">
                      Verified Skill
                    </p>
                  </div>
                );
              })
            ) : (
              /* Tampilan Jika Array Kosong [] */
              <div className="col-span-full bg-white border border-dashed border-slate-200 p-12 rounded-2xl text-center shadow-sm">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Code2 className="w-5 h-5" />
                </div>
                <p className="text-sm text-slate-700 font-bold">Belum ada skill yang terdeteksi</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Silakan upload dokumen atau resume CV terbaru kamu di Dashboard terlebih dahulu untuk menganalisis skillset.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="text-center text-[11px] text-slate-400 pt-8 border-t border-slate-100">
        © 2026 AI Skill & Career Pathway Analyzer
      </footer>

    </div>
  );
}

export default Profile;