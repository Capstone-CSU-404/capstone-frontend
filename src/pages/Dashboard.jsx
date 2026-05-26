import { useState } from "react"
import {
  Sparkles,
  ArrowRight,
} from "lucide-react"

import { Link } from "react-router-dom"

import {
  getJobRecommendation,
  uploadCV,
} from "../services/jobRole"

import SkillBadge from "../components/SkillBadge"
import InputSkill from "../components/InputSkill"

// helper cn
function cn(...classes) {
  return classes.filter(Boolean).join(" ")
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

  const [recommendations, setRecommendations] =
    useState([])

  const [selectedFile, setSelectedFile] =
    useState(null)

  const handleRemoveFile = () => {

    setSelectedFile(null)

    setFileName("")
  }    

  // console.log(
  //   "CURRENT SKILLS:",
  //   skills
  // )

  // console.log(
  //   "Recommendations:",
  //   recommendations
  // )

  // ================= FILE =================
  const handleFileChange = (e) => {

    const file = e.target.files[0]

    if (file) {

      setFileName(file.name)

      setSelectedFile(file)

      console.log(
        "SELECTED FILE:",
        file
      )
    }
  }

  // ================= ADD SKILL =================
  const handleAddSkill = (e) => {

    e.preventDefault()

    if (!newSkill.trim()) return

    const parsedSkills = newSkill
      .split(",")
      .map((skill) =>
        skill.trim().toLowerCase()
      )
      .filter(Boolean)

    const updatedSkills = [
      ...new Set([
        ...skills,
        ...parsedSkills,
      ]),
    ]

    console.log(
      "UPDATED SKILLS:",
      updatedSkills
    )

    setSkills(updatedSkills)

    setNewSkill("")
  }

  // ================= REMOVE SKILL =================
  const handleRemoveSkill = (
    skillToRemove
  ) => {

    setSkills(
      skills.filter(
        (skill) =>
          skill !== skillToRemove
      )
    )
  }

  // ================= AI ANALYSIS =================
  const handleAnalyze = async () => {

    try {

      setLoading(true)

      // ================= PDF MODE =================
      if (selectedFile) {

        console.log(
          "UPLOADING PDF..."
        )

        const uploadResponse =
          await uploadCV(selectedFile)

        console.log(
          "PDF AI Response:",
          uploadResponse
        )

        setRecommendations(
          uploadResponse?.top_roles || []
        )

        return
      }

      // ================= MANUAL SKILL MODE =================
      const payload = {
        name:
          user?.name || "Anonymous",
        skillset: skills,
      }

      console.log(
        "FINAL PAYLOAD:",
        payload
      )

      const response =
        await getJobRecommendation(
          payload
        )

      console.log(
        "AI Response:",
        response
      )

      setRecommendations(
        response?.top_roles || []
      )

    } catch (error) {

      console.error(
        "ANALYZE ERROR:",
        error
      )

      alert(
        "Failed to generate AI recommendation"
      )

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

          <span className="text-sm">
            AI Assistant
          </span>

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

          <div className="col-span-12 mt-6">

            <div className="mb-4">

              <h3 className="text-xl font-bold">
                Recommended Career Paths
              </h3>

              <p className="text-sm text-slate-500">
                Matches found based on your AI analysis
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {recommendations.map(
                (item, i) => (

                  <div
                    key={i}
                    className="
                      bg-white border border-slate-100
                      rounded-2xl p-5
                      shadow-sm hover:shadow-md
                      hover:border-indigo-100
                      transition-all
                      flex flex-col
                      min-w-0
                    "
                  >

                    {/* HEADER */}
                    <div className="flex items-start justify-between gap-3 mb-4">

                      <div className="min-w-0">

                        <h4 className="font-bold text-slate-900 text-lg break-words">
                          {item.role}
                        </h4>

                        <p className="text-xs text-slate-400 mt-1">
                          AI career recommendation
                        </p>

                      </div>

                      <span
                        className="
                          shrink-0
                          text-xs font-semibold
                          px-3 py-1
                          bg-emerald-50
                          text-emerald-600
                          rounded-full
                        "
                      >
                        {(
                          item.confidence * 100
                        ).toFixed(0)}%
                      </span>

                    </div>

                    {/* SKILLS */}
                    <div className="flex-1">

                      <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                        Recommended Skills
                      </p>

                      <SkillBadge
                        skills={
                          item.skill_gap?.slice(
                            0,
                            8
                          ) || []
                        }
                        ai={true}
                      />

                    </div>

                    {/* FOOTER */}
                    <button
                      className="
                        mt-5
                        text-indigo-500
                        text-sm font-medium
                        flex items-center gap-1
                        hover:text-indigo-600
                        transition-colors
                      "
                    >

                      Explore Career

                      <ArrowRight className="w-4 h-4" />

                    </button>

                  </div>
                )
              )}

            </div>
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