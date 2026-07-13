import { useState, useEffect, useRef } from "react"
import { Loader2, Search } from "lucide-react"

import { getJobRecommendation, uploadCV } from "../services/jobRole"
import api from "../services/api"

//component
import InputSkill from "../components/InputSkill"
import SkillBadge from "../components/SkillBadge"
import Toast from "../components/Toast"
import DetectedSkills from "../components/DetectedSkills"
import CareerPathCard from "../components/CareerPathCard"
import JobRecommendations from "../components/JobRecommendations"

function Dashboard() {
  const storedUser = JSON.parse(localStorage.getItem("user"))
  const user = storedUser?.data?.user

  
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })
  const [fileName, setFileName] = useState(() => sessionStorage.getItem("dashboard_fileName") || "")
  const [skills, setSkills] = useState(() => JSON.parse(sessionStorage.getItem("dashboard_skills")) || [])
  const [newSkill, setNewSkill] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [extractedSkills, setExtractedSkills] = useState(() => JSON.parse(sessionStorage.getItem("dashboard_extractedSkills")) || [])
  const [narrativeText, setNarrativeText] = useState(() => sessionStorage.getItem("dashboard_narrativeText") || "")
  const [hasAnimated, setHasAnimated] = useState(() => JSON.parse(sessionStorage.getItem("dashboard_hasAnimated")) || false)
  const [activeTab, setActiveTab] = useState("general")
  const [roadmap, setRoadmap] = useState(() => JSON.parse(sessionStorage.getItem("dashboard_roadmap")) || [])
  const [roadmapLoading, setRoadmapLoading] = useState(false)
  const [jobRecommendations, setJobRecommendations] = useState(() => JSON.parse(sessionStorage.getItem("dashboard_jobs")) || [])
  const [jobLoading, setJobLoading] = useState(false)
  const [pathwayCompletedSkills, setPathwayCompletedSkills] = useState([])

  const [recommendations, setRecommendations] = useState(() => JSON.parse(sessionStorage.getItem("dashboard_recommendations")) || [])

  
  const [githubUrl, setGithubUrl] = useState(() => sessionStorage.getItem("dashboard_githubUrl") || "")
  const [githubRecommendations, setGithubRecommendations] = useState(() => JSON.parse(sessionStorage.getItem("dashboard_githubRecommendations")) || [])
  const [githubNarrativeText, setGithubNarrativeText] = useState(() => sessionStorage.getItem("dashboard_githubNarrativeText") || "")
  const [githubRoadmap, setGithubRoadmap] = useState(() => JSON.parse(sessionStorage.getItem("dashboard_githubRoadmap")) || [])

  const resultRef = useRef(null)
  const jobRef = useRef(null)

  const topRole = recommendations[0]
  const otherRoles = recommendations.slice(1)

  const githubTopRole = githubRecommendations[0]
  const githubOtherRoles = githubRecommendations.slice(1)

  const showNotification = (message, type = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => { setToast({ show: false, message: "", type: "success" }) }, 3000)
  }

  
  useEffect(() => { sessionStorage.setItem("dashboard_skills", JSON.stringify(skills)) }, [skills])
  useEffect(() => { sessionStorage.setItem("dashboard_fileName", fileName) }, [fileName])
  useEffect(() => {
    sessionStorage.setItem("dashboard_recommendations", JSON.stringify(recommendations))
    sessionStorage.setItem("dashboard_extractedSkills", JSON.stringify(extractedSkills))
  }, [recommendations, extractedSkills])
  useEffect(() => { sessionStorage.setItem("dashboard_narrativeText", narrativeText) }, [narrativeText])
  useEffect(() => { sessionStorage.setItem("dashboard_hasAnimated", JSON.stringify(hasAnimated)) }, [hasAnimated])
  useEffect(() => { sessionStorage.setItem("dashboard_roadmap", JSON.stringify(roadmap)) }, [roadmap])
  useEffect(() => { sessionStorage.setItem("dashboard_jobs", JSON.stringify(jobRecommendations)) }, [jobRecommendations])
  
  useEffect(() => { sessionStorage.setItem("dashboard_githubUrl", githubUrl) }, [githubUrl])
  useEffect(() => { sessionStorage.setItem("dashboard_githubRecommendations", JSON.stringify(githubRecommendations)) }, [githubRecommendations])
  useEffect(() => { sessionStorage.setItem("dashboard_githubNarrativeText", githubNarrativeText) }, [githubNarrativeText])
  useEffect(() => { sessionStorage.setItem("dashboard_githubRoadmap", JSON.stringify(githubRoadmap)) }, [githubRoadmap])

  //efek ketik CV
  useEffect(() => {
    if (recommendations.length > 0) {
      if (resultRef.current && !narrativeText) {
        resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      if (!narrativeText) {
        const ownedSkillNames = recommendations[0].user_skill?.map((s) => s.skill).join(", ")
        setNarrativeText(
          `Career path yang paling direkomendasikan untukmu berdasarkan CV saat ini adalah ${recommendations[0].role}. Kamu sudah memiliki modal dasar yang bagus dengan menguasai skill seperti ${ownedSkillNames || "beberapa core skill"}. Untuk memperkecil gap dan mempercepat langkahmu menjadi seorang ${recommendations[0].role}, berikut adalah beberapa skill prioritas yang disarankan untuk kamu pelajari berikutnya:`
        )
      }
    } else {
      setNarrativeText("")
    }
  }, [recommendations, narrativeText])

  //efek ketik github
  useEffect(() => {
    if (githubRecommendations.length > 0) {
      if (resultRef.current && !recommendations.length && !githubNarrativeText) {
        resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      if (!githubNarrativeText) {
        const githubOwnedSkills = githubRecommendations[0].user_skill?.map((s) => s.skill).join(", ")
        setGithubNarrativeText(
          `Berdasarkan isi kode Repositori GitHub kamu, peran IT yang paling potensial untukmu adalah ${githubRecommendations[0].role}. Penggunaan tech stack seperti ${githubOwnedSkills || "kumpulan pustaka kode Anda"} terdeteksi sangat baik. Berikut kompetensi gap industri yang disarankan untuk melengkapi kapasitas repositori kodingmu:`
        )
      }
    } else {
      setGithubNarrativeText("")
    }
  }, [githubRecommendations, githubNarrativeText, recommendations])

  useEffect(() => {
    if ((narrativeText || githubNarrativeText) && !hasAnimated) {
      const timer = setTimeout(() => { setHasAnimated(true) }, 1000)
      return () => clearTimeout(timer)
    }
  }, [narrativeText, githubNarrativeText, hasAnimated])

  useEffect(() => {
    const fetchLastAnalyzedSkills = async () => {
      const actualUserId = user?.uid || user?.id || (typeof storedUser === "string" ? JSON.parse(storedUser)?.uid : storedUser?.uid)
      if (actualUserId && !selectedFile && !githubUrl) {
        try {
          const response = await api.get(`/profile/skillset?userId=${actualUserId}`)
          if (response.data && response.data.status === "ok") {
            const lastSkills = response.data.data?.skills || response.data.skills || []
            setExtractedSkills(lastSkills)
          }
        } catch (err) { console.error(err) }
      }
    }
    fetchLastAnalyzedSkills()
  }, [selectedFile, githubUrl, user, storedUser])

  const clearPreviousResults = () => {
    setRecommendations([])
    setGithubRecommendations([])
    setExtractedSkills([])
    setNarrativeText("")
    setGithubNarrativeText("")
    setHasAnimated(false)
    setRoadmap([])
    setGithubRoadmap([])
    setJobRecommendations([])
    setActiveTab("general")
    sessionStorage.removeItem("dashboard_recommendations")
    sessionStorage.removeItem("dashboard_githubRecommendations")
    sessionStorage.removeItem("dashboard_extractedSkills")
    sessionStorage.removeItem("dashboard_narrativeText")
    sessionStorage.removeItem("dashboard_githubNarrativeText")
    sessionStorage.removeItem("dashboard_hasAnimated")
    sessionStorage.removeItem("dashboard_roadmap")
    sessionStorage.removeItem("dashboard_githubRoadmap")
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
    const parsedSkills = newSkill.split(",").map((s) => s.trim()).filter(Boolean)
    setSkills([...new Set([...skills, ...parsedSkills])])
    setNewSkill("")
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const fetchSpecificRoadmap = async (skillGapsArray) => {
    try {
      const response = await api.post("/career/roadmap", { skillGaps: skillGapsArray })
      if (response.data && response.data.success) return response.data.roadmap || []
    } catch (err) { console.error(err) }
    return []
  }

  
  const handleSaveSkillToPathway = async (skillName, targetedRole) => {
      const rawStorage = localStorage.getItem("user");
    const parsedStorage = rawStorage ? JSON.parse(rawStorage) : null;
    
    
    const actualUserId = 
      parsedStorage?.data?.user?.uid || 
      parsedStorage?.data?.user?.id || 
      parsedStorage?.user?.uid || 
      parsedStorage?.user?.id || 
      parsedStorage?.uid || 
      parsedStorage?.id ||
      user?.uid || 
      user?.id;

    
    const finalRole = targetedRole || githubTopRole?.role || topRole?.role || "General Path";

    // console.log("=== DEBUG TRACK SKILL ===");
    // console.log("ID User Terdeteksi:", actualUserId);
    // console.log("Nama Skill:", skillName);
    // console.log("Target Role:", finalRole);

    if (!actualUserId) {
      showNotification("Sesi user tidak valid atau kedaluwarsa. Silakan refresh atau re-login.", "error");
      return;
    }

    try {
      const response = await api.post("/pathway", {
        user_id: actualUserId,
        skill_name: skillName,
        target_role: finalRole
      });

      if (response.status === 201 || response.data?.success) {
        showNotification(`Skill "${skillName}" berhasil disimpan ke target profil!`, "success");
        
        // Opsional: Perbarui state lokal agar tanda centang/bintang langsung sinkron aktif
        setPathwayCompletedSkills(prev => [...new Set([...prev, skillName])]);
      }
    } catch (err) {
      console.error("Gagal menambahkan skill ke pathway:", err);
      showNotification(err.response?.data?.message || "Gagal menambahkan skill.", "error");
    }
  };
  const handleAnalyze = async () => {
    const hasCV = !!selectedFile || skills.length > 0 || extractedSkills.length > 0
    const hasGithub = !!githubUrl.trim()

    if (!hasCV && !hasGithub) {
      showNotification("Silakan unggah dokumen CV atau isi tautan GitHub repository terlebih dahulu.", "error")
      return
    }

    try {
      setLoading(true)
      clearPreviousResults()

      const actualUserId = user?.uid || user?.id || (typeof storedUser === "string" ? JSON.parse(storedUser)?.uid : storedUser?.uid)
      let completedStarredSkills = []

      if (actualUserId) {
        try {
          const pathwayResponse = await api.get(`/pathway/${actualUserId}`)
          const dataArray = Array.isArray(pathwayResponse.data) ? pathwayResponse.data : (pathwayResponse.data?.data || [])
          completedStarredSkills = dataArray.filter(item => item?.status === "completed").map(item => item?.skill_name)
          setPathwayCompletedSkills(completedStarredSkills)
        } catch (pe) { console.error(pe) }
      }
      
      //jika ada CV
      if (hasCV) {
        const baseSkills = selectedFile ? skills : extractedSkills
        const finalSkillsPayload = [...new Set([...baseSkills, ...completedStarredSkills])]
        let cvResponse

        if (selectedFile) {
          cvResponse = await uploadCV({ file: selectedFile, skills: finalSkillsPayload, name: user?.name })
        } else {
          cvResponse = await getJobRecommendation({ name: user?.name || "Anonymous", skillset: finalSkillsPayload })
        }

        const cvRoles = cvResponse?.top_roles || []
        setRecommendations(cvRoles)

        const detected = cvResponse?.extracted_skills || baseSkills
        setExtractedSkills(detected)

        if (cvRoles.length > 0) {
          const currentActive = [...new Set([...detected, ...finalSkillsPayload])]
          const gaps = (cvRoles[0].recommended_skill_to_learn || [])
            .filter(r => !currentActive.some(o => o.toLowerCase() === (typeof r === "object" ? r.skill.toLowerCase() : r.toLowerCase())))
            .map(s => typeof s === "object" ? s.skill : s)
          
          if (gaps.length > 0) {
            setRoadmapLoading(true)
            const rData = await fetchSpecificRoadmap(gaps)
            setRoadmap(rData)
            setRoadmapLoading(false)
          }
        }
      }

      //jika ada github
      if (hasGithub) {
        const response = await api.post("/document/github", { github_url: githubUrl.trim() })
        const gitData = response.data?.data || response.data
        const gitRoles = gitData?.top_roles || gitData?.recommendations || []
        
        setGithubRecommendations(gitRoles)

        if (gitRoles.length > 0) {
          const gitExtracted = gitData?.extracted_skills || gitData?.skills || []
          const gitGaps = (gitRoles[0].recommended_skill_to_learn || [])
            .filter(r => !gitExtracted.some(o => o.toLowerCase() === (typeof r === "object" ? r.skill.toLowerCase() : r.toLowerCase())))
            .map(s => typeof s === "object" ? s.skill : s)

          if (gitGaps.length > 0) {
            const gitRData = await fetchSpecificRoadmap(gitGaps)
            setGithubRoadmap(gitRData)
          }
        }
      }

      showNotification("AI Analysis berhasil memetakan kompetensi!", "success")
    } catch (error) {
      console.error(error)
      showNotification(error.response?.data?.message || "Gagal memproses rekomendasi.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleFetchJobs = async () => {
    const activeSkills = [...new Set([
      ...extractedSkills, 
      ...skills, 
      ...(githubRecommendations[0]?.user_skill?.map(s => s.skill) || [])
    ])]

    if (activeSkills.length === 0) {
      showNotification("Silakan lakukan analisis profil terlebih dahulu.", "error")
      return
    }
    try {
      setJobLoading(true)
      setJobRecommendations([])
      const response = await api.post("/jobs/recommendations", { skillset: activeSkills })
      if (response.data && (response.data.status === "success" || response.data.status === "ok")) {
        setJobRecommendations(response.data.data?.jobs || response.data.jobs || [])
        setTimeout(() => { jobRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }) }, 100)
      }
    } catch (err) { console.error(err) } finally { setJobLoading(false) }
  }

  return (
    <div className="w-full max-w-none space-y-12 relative">
      <header>
        <h3 className="text-indigo-500 font-semibold text-sm tracking-widest uppercase mb-2 block">Insights Engine</h3>
        <p className="text-slate-500 mt-1">Discover your ideal career path powered by AI analysis.</p>
      </header>
      <div className="space-y-6">
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
          githubUrl={githubUrl}
          setGithubUrl={setGithubUrl}
        />
      </div>

      {(recommendations.length > 0 || githubRecommendations.length > 0) && (
        <div ref={resultRef} className="col-span-12 mt-6 scroll-mt-24 space-y-12">
          
          {/* card CV */}
          {recommendations.length > 0 && (
            <div className="space-y-6 border-b border-slate-100 pb-12 animate-in fade-in duration-500">
              <div className="border-l-4 border-indigo-600 pl-3">
                <h3 className="text-lg font-bold text-slate-900">Hasil Rekomendasi Berdasarkan CV</h3>
                <p className="text-xs text-slate-500">Analisis kecocokan profil resume dokumen Anda</p>
              </div>

              <DetectedSkills
                extractedSkills={[...new Set([...extractedSkills, ...pathwayCompletedSkills])]}
                roadmap={roadmap}
              />

              <CareerPathCard
                topRole={topRole}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                narrativeText={narrativeText}
                hasAnimated={hasAnimated}
                roadmapLoading={roadmapLoading}
                roadmap={roadmap}
                handleSaveSkillToPathway={(name) => handleSaveSkillToPathway(name, topRole?.role)}
              />

              {activeTab === "general" && otherRoles.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alternative Career Paths (CV)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {otherRoles.map((item, i) => (
                      <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-bold text-slate-900 text-sm">{item.role}</h5>
                          <span className="text-xs px-2 py-0.5 bg-slate-50 rounded-full font-medium">{(item.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <SkillBadge skills={item.recommended_skill_to_learn?.slice(0, 5) || []} ai={true} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

      
          {/* card github */}
          {githubRecommendations.length > 0 && (
            <div className="space-y-6 pt-4 animate-in fade-in duration-500">
              <div className="border-l-4 border-emerald-600 pl-3">
                <h3 className="text-lg font-bold text-slate-900">Hasil Rekomendasi Berdasarkan GitHub</h3>
                <p className="text-xs text-slate-500">Analisis tumpukan teknologi repositori proyek kode</p>
              </div>

              <DetectedSkills
                extractedSkills={[
                  ...new Set([
                    ...(githubTopRole?.user_skill || []).map(s => typeof s === "object" ? s.skill : s),
                    ...(pathwayCompletedSkills || [])
                  ])
                ]}
                roadmap={githubRoadmap}
              />

              <CareerPathCard
                topRole={githubTopRole}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                narrativeText={githubNarrativeText}
                hasAnimated={hasAnimated}
                roadmapLoading={loading}
                roadmap={githubRoadmap}
                handleSaveSkillToPathway={(name) => handleSaveSkillToPathway(name, githubTopRole?.role)}
              />

              {activeTab === "general" && githubOtherRoles.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alternative Career Paths (GitHub)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {githubOtherRoles.map((item, i) => (
                      <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-bold text-slate-900 text-sm">{item.role}</h5>
                          <span className="text-xs px-2 py-0.5 bg-slate-50 rounded-full font-medium">{(item.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <SkillBadge skills={item.recommended_skill_to_learn?.slice(0, 5) || []} ai={true} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-100">
            <button
              onClick={handleFetchJobs}
              disabled={jobLoading || loading}
              className="w-full sm:w-auto bg-white border-2 border-indigo-600 text-indigo-600 font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all shadow-xs"
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
      )}

      <JobRecommendations jobRecommendations={jobRecommendations} jobLoading={jobLoading} jobRef={jobRef} />
      <footer className="text-xs text-slate-500 pt-6 border-t">© 2026 SkillsGap AI Platform</footer>
      <Toast toast={toast} setToast={setToast} />
    </div>
  )
}

export default Dashboard