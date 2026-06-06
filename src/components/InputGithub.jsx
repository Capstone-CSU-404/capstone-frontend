import React from "react"
import { FolderGit2, Loader2, Sparkles } from "lucide-react"

function InputGithub({ githubUrl, setGithubUrl, handleAnalyze, loading }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4 animate-in fade-in duration-300">
      <div>
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-slate-700" />
          <span>Analyze Kompetensi via Proyek GitHub</span>
        </h4>
        <p className="text-xs text-slate-400 mt-0.5">
          Masukkan link repositori publik Anda. AI akan mengekstrak susunan bahasa pemrograman dan framework berkas kode Anda.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/username/nama-repository"
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all font-mono"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !githubUrl.trim()}
          className="bg-slate-950 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 transition-all shrink-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 fill-current text-amber-400" />
          )}
          <span>Run AI Repository Analysis</span>
        </button>
      </div>
    </div>
  )
}

export default InputGithub