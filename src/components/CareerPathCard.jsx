import { Sparkles, Loader2, Star } from "lucide-react"
import TypingEffect from "./TypingEffect"
import SkillBadge from "./SkillBadge"

function CareerPathCard({
  topRole,
  activeTab,
  setActiveTab,
  narrativeText,
  hasAnimated,
  roadmapLoading,
  roadmap,
  handleSaveSkillToPathway
}) {
  if (!topRole) return null

  return (
    <div className="w-full bg-white border border-slate-100 rounded-2xl p-0 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex flex-col min-w-0 overflow-hidden">
      
      {/* header */}
      <div className="p-6 pb-4 border-b border-slate-50 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-bold text-slate-900 text-xl break-words">{topRole.role}</h4>
          <p className="text-xs text-slate-400 mt-1">Highest matching career path</p>
        </div>
        <span className="shrink-0 text-sm font-bold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
          {(topRole.confidence * 100).toFixed(0)}% Match
        </span>
      </div>

      {/* tabs */}
      <div className="flex bg-slate-50/70 px-6 border-b border-slate-100">
        <button
          onClick={() => setActiveTab("general")}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === "general"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          General Info
        </button>
        <button
          onClick={() => setActiveTab("detail")}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === "detail"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Market Demand (Details)
        </button>
      </div>

      {/* content */}
      <div className="p-6 flex-1">
        {activeTab === "general" ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            <p className="text-sm text-slate-600 leading-relaxed min-h-[40px]">
              <TypingEffect text={narrativeText} speed={12} shouldAnimate={!hasAnimated} />
              {!hasAnimated && <span className="inline-block w-1 h-4 bg-indigo-500 ml-1 animate-pulse" />}
            </p>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recommended skills to learn:
              </p>
              <SkillBadge skills={topRole.recommended_skill_to_learn?.slice(0, 10) || []} ai={true} />
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prioritas Skill Gaps Berdasarkan Kebutuhan Bursa Loker Aktif:</span>
            </p>

            {roadmapLoading ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                <span>Mengkalkulasi tingkat urgensi bursa kerja...</span>
              </div>
            ) : roadmap.length > 0 ? (
              <div className="space-y-2.5">
                {roadmap.map((step, index) => {
                  const percentVal = step.skor_urgensi?.includes("%") ? step.skor_urgensi : `${step.skor_urgensi}%`
                  return (
                    <div
                      key={index}
                      className="bg-amber-50/40 border border-amber-100 rounded-xl p-3.5 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-amber-50 transition-colors"
                    >
                      <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0">
                            {step.langkah ?? index + 1}
                          </span>
                          <div>
                            <span className="font-bold text-slate-800">Pelajari "{step.skill}"</span>
                            <span className="text-[10px] bg-indigo-50 text-indigo-600 ml-2 px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider">
                              {step.kategori || "Technical"}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSaveSkillToPathway(step.skill)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-300 transition-colors shadow-sm ml-2 group/star"
                          title="Tambahkan ke wishlist pembelajaran profile"
                        >
                          <Star className="w-4 h-4 fill-none group-hover/star:fill-amber-400 transition-colors" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 sm:text-right">
                        karena dicari sebanyak <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-sm">{percentVal}</span> di industri saat ini.
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic pl-1">
                Skillset utamamu sudah lengkap memenuhi kebutuhan pasar industri utama role ini.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CareerPathCard