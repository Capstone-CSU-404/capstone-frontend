import { useState, useEffect, useRef } from "react"
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Building2,
  Loader2,
  Search
} from "lucide-react"

import { Link } from "react-router-dom"

import {
  getJobRecommendation,
  uploadCV,
} from "../services/jobRole"

import api from "../services/api"
import SkillBadge from "../components/SkillBadge"
import InputSkill from "../components/InputSkill"

// SUB-KOMPONEN: Efek animasi ketik yang aman & stabil
function TypingEffect({ text, speed = 15 }) {
  const [displayedText, setDisplayedText] = useState("")
  const indexRef = useRef(0)

  useEffect(() => {
    setDisplayedText("")
    indexRef.current = 0

    if (!text) return

    const timer = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.substring(0, indexRef.current + 1))
        indexRef.current += 1
      } else {
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return <span>{displayedText}</span>
}

function Dashboard() {
  // Ambil data user & token dari localStorage sesuai instruksi BE
  const storedUser = JSON.parse(localStorage.getItem("user"))
  const user = storedUser?.data?.user

  // Ambil token JWT (menyesuaikan struktur response auth backend-mu biasanya di storedUser.token atau storedUser.data.token)
  const token = storedUser?.token || storedUser?.data?.token || localStorage.getItem("token")

  // ================= STATE =================
  const [fileName, setFileName] = useState(() => sessionStorage.getItem("dashboard_fileName") || "")
  const [skills, setSkills] = useState(() => JSON.parse(sessionStorage.getItem("dashboard_skills")) || [])
  const [newSkill, setNewSkill] = useState("")
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState(() => JSON.parse(sessionStorage.getItem("dashboard_recommendations")) || [])
  const [selectedFile, setSelectedFile] = useState(null)
  const [showMore, setShowMore] = useState(() => JSON.parse(sessionStorage.getItem("dashboard_showMore")) || false)
  const [extractedSkills, setExtractedSkills] = useState(() => JSON.parse(sessionStorage.getItem("dashboard_extractedSkills")) || [])
  const [narrativeText, setNarrativeText] = useState(() => sessionStorage.getItem("dashboard_narrativeText") || "")

  // State untuk lowongan kerja dari BE baru
  const [jobRecommendations, setJobRecommendations] = useState(() => JSON.parse(sessionStorage.getItem("dashboard_jobs")) || [])
  const [jobLoading, setJobLoading] = useState(false)

  const resultRef = useRef(null)
  const jobRef = useRef(null)

  const topRole = recommendations[0]
  const otherRoles = recommendations.slice(1)

  // ================= EFFECTS FOR SESSION PERSISTENCE =================
  useEffect(() => {
    sessionStorage.setItem("dashboard_skills", JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    sessionStorage.setItem("dashboard_fileName", fileName);
  }, [fileName]);

  useEffect(() => {
    sessionStorage.setItem("dashboard_recommendations", JSON.stringify(recommendations));
    sessionStorage.setItem("dashboard_extractedSkills", JSON.stringify(extractedSkills));
    sessionStorage.setItem("dashboard_showMore", JSON.stringify(showMore));
  }, [recommendations, extractedSkills, showMore]);

  useEffect(() => {
    sessionStorage.setItem("dashboard_narrativeText", narrativeText);
  }, [narrativeText]);

  useEffect(() => {
    sessionStorage.setItem("dashboard_jobs", JSON.stringify(jobRecommendations));
  }, [jobRecommendations]);

  // Efek penata narasi otomatis
  useEffect(() => {
    if (recommendations.length > 0) {
      if (resultRef.current && !narrativeText) {
        resultRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }

      if (!narrativeText) {
        const ownedSkillNames = recommendations[0].user_skill
          ?.map((s) => s.skill)
          .join(", ")

        setNarrativeText(
          `Career path yang paling direkomendasikan untukmu saat ini adalah ${recommendations[0].role}. Kamu sudah memiliki modal dasar yang bagus dengan menguasai skill seperti ${ownedSkillNames}. Untuk memperkecil gap dan mempercepat langkahmu menjadi seorang ${recommendations[0].role}, berikut adalah beberapa skill prioritas yang disarankan untuk kamu pelajari berikutnya:`
        )
      }
    } else {
      setShowMore(false)
      setNarrativeText("")
    }
  }, [recommendations, narrativeText])

  const clearPreviousResults = () => {
    setRecommendations([])
    setExtractedSkills([])
    setNarrativeText("")
    setShowMore(false)
    setJobRecommendations([])

    sessionStorage.removeItem("dashboard_recommendations")
    sessionStorage.removeItem("dashboard_extractedSkills")
    sessionStorage.removeItem("dashboard_narrativeText")
    sessionStorage.removeItem("dashboard_showMore")
    sessionStorage.removeItem("dashboard_jobs")
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFileName("")
    sessionStorage.removeItem("dashboard_fileName")
    clearPreviousResults()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      setSelectedFile(file)
      clearPreviousResults()
    }
  }

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (!newSkill.trim()) return

    const parsedSkills = newSkill
      .split(",")
      .map((skill) => skill.trim()) // Mempertahankan casing asli sesuai anjuran BE (Contoh: "React", "JavaScript")
      .filter(Boolean)

    const updatedSkills = [
      ...new Set([
        ...skills,
        ...parsedSkills,
      ]),
    ]

    setSkills(updatedSkills)
    setNewSkill("")
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  // ================= 1. FUNGSI ANALISIS CV (TOMBOL UTAMA) =================
  const handleAnalyze = async () => {
    try {
      clearPreviousResults()
      setLoading(true)

      let responseData;
      if (selectedFile) {
        responseData = await uploadCV({
          file: selectedFile,
          skills,
          name: user?.name,
        })
      } else {
        const payload = {
          name: user?.name || "Anonymous",
          skillset: skills,
        }
        responseData = await getJobRecommendation(payload)
      }

      setExtractedSkills(responseData?.extracted_skills || [])
      setRecommendations(responseData?.top_roles || [])

    } catch (error) {
      console.error("ANALYZE ERROR:", error)
      alert("Failed to generate AI recommendation")
    } finally {
      setLoading(false)
    }
  }


  const handleFetchJobs = async () => {
    const activeSkills = extractedSkills.length > 0 ? extractedSkills : skills;

    if (activeSkills.length === 0) {
      alert("Silakan masukkan skill atau lakukan analisis CV terlebih dahulu agar sistem bisa mencocokkan lowongan.");
      return;
    }

    try {
      setJobLoading(true)
      setJobRecommendations([])

      // Tembak API menggunakan Axios instance
      const response = await api.post("/jobs/recommendations", {
        skillset: activeSkills
      });

      const result = response.data;

      // 🚀 PERBAIKAN DI SINI: Izinkan status 'ok' atau 'success' sesuai standarisasi BE kamu
      if (result && (result.status === 'success' || result.status === 'ok')) {
        setJobRecommendations(result.data.jobs || []);

        setTimeout(() => {
          jobRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        console.error('Gagal mengambil data:', result?.message);
        alert(`Gagal memuat lowongan: ${result?.message || 'Error internal server'}`);
      }
    } catch (jobError) {
      console.error("Terjadi kesalahan koneksi/request:", jobError);
      const errorMsg = jobError.response?.data?.message || "Terjadi kesalahan koneksi ke server loker.";
      alert(errorMsg);
    } finally {
      setJobLoading(false)
    }
  }

  return (
    <div className="w-full max-w-none space-y-12">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div className="w-full">
          <h3 className="text-indigo-500 font-semibold text-sm tracking-widest uppercase mb-2 block">
            Insights Engine
          </h3>
          <p className="text-slate-500 mt-3">
            Discover your ideal career path powered by AI analysis.
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <div className="grid grid-cols-12 gap-6">

        {/* INPUT PANEL SKILL & CV */}
        <div className="col-span-12 space-y-4">
          <InputSkill
            handleAnalyze={handleAnalyze}
            skills={skills}
            loading={loading}
            handleFileChange={handleFileChange}
            handleAddSkill={handleAddSkill}
            fileName={fileName}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            handleRemoveSkill={handleRemoveSkill}
            handleRemoveFile={handleRemoveFile}
          />

          {/* UTILITY BUTTON BARU (DIPISAH) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              onClick={handleFetchJobs}
              disabled={jobLoading || loading}
              className="w-full sm:w-auto bg-white border-2 border-indigo-600 text-indigo-600 font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm"
            >
              {jobLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mencari Lowongan...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Cari Rekomendasi Lowongan Pekerjaan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AREA HASIL REKOMENDASI KARIER */}
        {recommendations.length > 0 && (
          <div ref={resultRef} className="col-span-12 mt-6 scroll-mt-24 space-y-12">
            <div className="space-y-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold">Recommended Career Paths</h3>
                <p className="text-sm text-slate-500">Matches found based on your AI analysis</p>
              </div>

              {extractedSkills.length > 0 && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Detected Core Skills ({extractedSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedSkills.map((sk, idx) => (
                      <span key={idx} className="bg-white border text-slate-700 text-xs px-2.5 py-1 rounded-md shadow-sm">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {topRole && (
                <div className="w-full bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex flex-col min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-xl break-words">{topRole.role}</h4>
                      <p className="text-xs text-slate-400 mt-1">Highest matching career path</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                      {(topRole.confidence * 100).toFixed(0)}% Match
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mb-5 leading-relaxed min-h-[40px]">
                    <TypingEffect text={narrativeText} speed={12} />
                    <span className="inline-block w-1 h-4 bg-indigo-500 ml-1 animate-pulse" />
                  </p>

                  <div className="flex-1 mb-6">
                    <SkillBadge skills={topRole.recommended_skill_to_learn?.slice(0, 10) || []} ai={true} />
                  </div>

                  {otherRoles.length > 0 && (
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="w-fit text-indigo-500 text-sm font-medium flex items-center gap-1 hover:text-indigo-600 transition-colors"
                    >
                      {showMore ? <>Show Less <ChevronUp className="w-4 h-4" /></> : <>More <ChevronDown className="w-4 h-4" /></>}
                    </button>
                  )}
                </div>
              )}

              {showMore && otherRoles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-in fade-in duration-300">
                  {otherRoles.map((item, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex flex-col min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-base break-words">{item.role}</h4>
                          <p className="text-xs text-slate-400 mt-1">Alternative path</p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold px-2.5 py-1 bg-slate-50 text-slate-600 rounded-full">
                          {(item.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex-1">
                        <SkillBadge skills={item.recommended_skill_to_learn?.slice(0, 8) || []} ai={true} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SEKSI TAMPILAN REKOMENDASI PEKERJAAN BERDASARKAN API BE ================= */}
        {(jobRecommendations.length > 0 || jobLoading) && (
          <div ref={jobRef} className="col-span-12 pt-6 border-t border-slate-100 space-y-6 scroll-mt-24 animate-in fade-in duration-300">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-500" />
                <span>Real-world Job Openings for You</span>
              </h3>
              <p className="text-sm text-slate-500">
                Pekerjaan aktif di database yang paling relevan dengan skillset terdeteksimu
              </p>
            </div>

            {jobLoading ? (
              <div className="min-h-[150px] bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
                <p className="text-xs text-slate-400 font-medium">Matching vacancies from companies...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobRecommendations.map((job, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-200">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors" title={job.title}>
                          {job.title || "Untitled Role"}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {job.company || "Unknown Company"}
                        </p>
                        {/* Menampilkan lokasi jika dikirim oleh BE */}
                        {job.location && (
                          <p className="text-xs text-slate-400 mt-1">
                            📍 {job.location}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                        
                      {job.job_url ? (
                        <a
                          href={job.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer"
                        >
                          Apply Job →
                        </a>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 cursor-not-allowed">
                          No Link Available
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="text-xs text-slate-500 pt-6 border-t">
        © 2026 SkillsGap AI Platform
      </footer>

    </div>
  )
}

export default Dashboard