import { useState } from "react"
import { TrendingUp, Sparkles, ArrowRight, UploadCloud, Plus } from "lucide-react"
import { Link } from "react-router-dom"

// helper cn
function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

function Dashboard() {
  // State contoh untuk kebutuhan interaksi form mockup
  const [fileName, setFileName] = useState("")
  const [skills, setSkills] = useState(["React", "Tailwind CSS", "UI Design"])
  const [newSkill, setNewSkill] = useState("")

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  return (
    <div className="space-y-12">

      {/* Header */}
      <header className="flex justify-between items-end">
        <div className="max-w-2xl">
          <span className="text-indigo-500 font-semibold text-sm tracking-widest uppercase mb-2 block">
            Insights Engine
          </span>
          <h2 className="text-4xl font-bold leading-tight">
            Your trajectory is{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              ascending
            </span>
          </h2>
        </div>

        <Link
          to="/chat"
          className="bg-white border px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm hover:bg-indigo-50 transition-all"
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-sm">AI Active</span>
        </Link>
      </header>

      {/* Grid Utama */}
      <div className="grid grid-cols-12 gap-6">

        {/* ================= BARU: UPLOAD & INPUT SKILLSET ================= */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-1">Analyze Your Skills</h3>
            <p className="text-sm text-slate-500 mb-4">Upload your CV and state your current skills for AI Analysis.</p>
            
            {/* File Upload Zone */}
            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-indigo-500 transition-colors group cursor-pointer">
              <input 
                type="file" 
                accept=".pdf" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileChange}
              />
              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mx-auto mb-2 transition-colors" />
              <p className="text-sm font-medium text-slate-700">
                {fileName ? fileName : "Upload CV / Portfolio (PDF)"}
              </p>
              <p className="text-xs text-slate-400 mt-1">Max size 5MB</p>
            </div>

            {/* Skill Tags Input */}
            <div className="mt-5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Current Skillset</label>
              <form onSubmit={handleAddSkill} className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  placeholder="e.g. Node.js" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button type="submit" className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </form>
              
              {/* Skill Badges Wrapper */}
              <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
                {skills.map((skill, index) => (
                  <span key={index} className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2.5 py-1 rounded-md border border-indigo-100/50">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button className="w-full bg-indigo-500 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-indigo-600 shadow-sm shadow-indigo-100 transition-all">
            Run AI Gap Analysis
          </button>
        </div>

        {/* Score Card & Skills Gap Grouped on Right Side */}
        <div className="col-span-12 lg:col-span-7 grid grid-cols-1 gap-6">
          
          {/* Score Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-50">
            <h3 className="text-lg font-bold mb-2">Job Readiness Score</h3>
            <p className="text-sm text-slate-500 mb-4">Based on market demand</p>

            <div className="flex items-baseline gap-4">
              <div className="text-5xl font-bold text-indigo-500">84</div>
              <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +12% improvement
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full h-2 bg-slate-100 rounded-full">
                <div className="w-[84%] h-full bg-indigo-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Skills Gap */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-50">
            <h3 className="text-lg font-bold mb-4">Skills Gap</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {[
                { name: "Technical Skills", val: "63%" },
                { name: "Design", val: "23%" },
                { name: "AI Tools", val: "31%" },
                { name: "Soft Skills", val: "73%" },
                { name: "Strategy", val: "74%" },
              ].map((skill, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-1">
                  <span className="text-slate-700 font-medium">{skill.name}</span>
                  <span className="text-indigo-600 font-semibold bg-indigo-50/50 px-2 py-0.5 rounded text-xs">{skill.val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Career Cards (Static Responses) */}
        <div className="col-span-12 mt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">Recommended Career Paths</h3>
              <p className="text-sm text-slate-500">Matches found based on your analyzed credentials</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: "AI Engineer",
                desc: "Work with machine learning models",
                match: "94% Match"
              },
              {
                title: "Frontend Developer",
                desc: "Build modern web apps",
                match: "88% Match"
              },
              {
                title: "Product Manager",
                desc: "Lead product development",
                match: "75% Match"
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">{item.match}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-6">
                    {item.desc}
                  </p>
                </div>
                <button className="text-indigo-500 text-sm font-medium flex items-center gap-1 hover:text-indigo-600 transition-colors mt-auto">
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="text-xs text-slate-500 pt-6 border-t">
        © 2026 SkillsGap AI Platform
      </footer>
    </div>
  )
}

export default Dashboard