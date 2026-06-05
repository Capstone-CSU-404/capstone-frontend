import { useState, useEffect, useRef } from "react"
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

import { Link } from "react-router-dom"

import {
  getJobRecommendation,
  uploadCV,
} from "../services/jobRole"

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
  const storedUser = JSON.parse(
    localStorage.getItem("user")
  )
  const user = storedUser?.data?.user

  // ================= STATE =================
  const [fileName, setFileName] = useState("")
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState("")
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [showMore, setShowMore] = useState(false)
  
  // State baru untuk menampung seluruh extracted_skills dari BE
  const [extractedSkills, setExtractedSkills] = useState([])
  const [narrativeText, setNarrativeText] = useState("")

  const resultRef = useRef(null)

  const topRole = recommendations[0]
  const otherRoles = recommendations.slice(1)

  // Efek pendeteksi data masuk
  useEffect(() => {
    if (recommendations.length > 0) {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }

      // Ambil teks nama-nama skill yang dimiliki user untuk dimasukkan ke teks narasi
      const ownedSkillNames = recommendations[0].user_skill
        ?.map((s) => s.skill)
        .join(", ")

      // Set susunan narasi baru yang profesional
      setNarrativeText(
        `Career path yang paling direkomendasikan untukmu saat ini adalah ${recommendations[0].role}. Kamu sudah memiliki modal dasar yang bagus dengan menguasai skill seperti ${ownedSkillNames}. Untuk memperkecil gap dan mempercepat langkahmu menjadi seorang ${recommendations[0].role}, berikut adalah beberapa skill prioritas yang disarankan untuk kamu pelajari berikutnya:`
      )
    } else {
      setShowMore(false)
      setNarrativeText("")
    }
  }, [recommendations])

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFileName("")
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      setSelectedFile(file)
    }
  }

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (!newSkill.trim()) return

    const parsedSkills = newSkill
      .split(",")
      .map((skill) => skill.trim().toLowerCase())
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

  // ================= AI ANALYSIS =================
  const handleAnalyze = async () => {
    try {
      setLoading(true)
      setShowMore(false)

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

      // Simpan extracted_skills global dan list top_roles ke state masing-masing
      setExtractedSkills(responseData?.extracted_skills || [])
      setRecommendations(responseData?.top_roles || [])

    } catch (error) {
      console.error("ANALYZE ERROR:", error)
      alert("Failed to generate AI recommendation")
    } finally {
      setLoading(false)
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

        <Link
          to="/chat"
          className="bg-white border px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm hover:bg-indigo-50 transition-all w-fit"
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-sm">AI Assistant</span>
        </Link>
      </header>

      {/* CONTENT */}
      <div className="grid grid-cols-12 gap-6">

        {/* INPUT */}
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

        {/* RESULT */}
        {recommendations.length > 0 && (
          <div ref={resultRef} className="col-span-12 mt-6 scroll-mt-24 space-y-6">

            <div className="mb-4">
              <h3 className="text-xl font-bold">
                Recommended Career Paths
              </h3>
              <p className="text-sm text-slate-500">
                Matches found based on your AI analysis
              </p>
            </div>

            {/* BOX EXTRACTED SKILLS (Menampilkan seluruh isi extracted_skills global) */}
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

            {/* 1. CARD UTAMA (FULL WIDTH) */}
            {topRole && (
              <div className="w-full bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex flex-col min-w-0">

                {/* Header Card Utama */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-xl break-words">
                      {topRole.role}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Highest matching career path
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                    {(topRole.confidence * 100).toFixed(0)}% Match
                  </span>
                </div>

                {/* Narasi Dinamis + Efek Mengetik */}
                <p className="text-sm text-slate-600 mb-5 leading-relaxed min-h-[40px]">
                  <TypingEffect text={narrativeText} speed={12} />
                  <span className="inline-block w-1 h-4 bg-indigo-500 ml-1 animate-pulse" />
                </p>

                {/* Badges Skill Rekomendasi yang Perlu Dipelajari */}
                <div className="flex-1 mb-6">
                  <SkillBadge
                    skills={topRole.recommended_skill_to_learn?.slice(0, 10) || []}
                    ai={true}
                  />
                </div>

                {/* Tombol More / Less */}
                {otherRoles.length > 0 && (
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="w-fit text-indigo-500 text-sm font-medium flex items-center gap-1 hover:text-indigo-600 transition-colors"
                  >
                    {showMore ? (
                      <>
                        Show Less <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        More <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* 2. CARD KECIL (ROLE ALTERNATIF) */}
            {showMore && otherRoles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-in fade-in duration-300">
                {otherRoles.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex flex-col min-w-0"
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-base break-words">
                          {item.role}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Alternative path
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold px-2.5 py-1 bg-slate-50 text-slate-600 rounded-full">
                        {(item.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex-1">
                      <SkillBadge
                        skills={item.recommended_skill_to_learn?.slice(0, 8) || []}
                        ai={true}
                      />
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