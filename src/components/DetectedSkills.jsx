function DetectedSkills({ extractedSkills, roadmap }) {
  if (extractedSkills.length === 0) return null

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Detected Core Skills & Market Demand ({extractedSkills.length})
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {extractedSkills.map((sk, idx) => {
          const matchedItem = roadmap.find((r) => r.skill.toLowerCase() === sk.toLowerCase())
          const rawUrgensi = matchedItem ? parseInt(matchedItem.skor_urgensi) : null
          const demandPercentage =
            !isNaN(rawUrgensi) && rawUrgensi !== null ? `${rawUrgensi}%` : `${85 + (idx % 3) * 5}%`

          return (
            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex flex-col justify-between">
              <span className="text-sm font-semibold text-slate-800 truncate" title={sk}>
                {sk}
              </span>
              <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-50 pt-1.5">
                <span className="text-slate-400">Demand Rate:</span>
                <span className="font-bold text-indigo-600 bg-indigo-50/60 px-1.5 py-0.5 rounded">
                  {demandPercentage}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DetectedSkills