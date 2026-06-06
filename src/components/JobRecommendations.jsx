import { Briefcase, Loader2, Building2 } from "lucide-react"

function JobRecommendations({ jobRecommendations, jobLoading, jobRef }) {
  if (!jobLoading && jobRecommendations.length === 0) return null

  return (
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
                  {job.location && <p className="text-xs text-slate-400 mt-1">📍 {job.location}</p>}
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
  )
}

export default JobRecommendations