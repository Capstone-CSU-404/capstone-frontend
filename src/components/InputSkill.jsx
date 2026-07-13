import React from "react"
import { Upload, X, FileText, Plus, Loader2, Sparkles, FolderGit2 } from "lucide-react"
import SkillBadge from "./SkillBadge"

function InputSkill({
  handleAnalyze,
  skills,
  loading,
  handleFileChange,
  handleAddSkill,
  fileName,
  newSkill,
  setNewSkill,
  handleRemoveSkill,
  handleRemoveFile,
  githubUrl,
  setGithubUrl
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
      {/* upload cv */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-900 block">
          Upload Curriculum Vitae (PDF)
        </label>
        
        {!fileName ? (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50/50 hover:border-indigo-400 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              <Upload className="w-8 h-8 text-slate-400 mb-3 group-hover:text-indigo-500 transition-colors" />
              <p className="text-sm font-semibold text-slate-700">Klik untuk unggah atau seret berkas CV</p>
              <p className="text-xs text-slate-400 mt-1">Mendukung format khusus PDF (Maks. 5MB)</p>
            </div>
            <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{fileName}</p>
                <p className="text-xs text-slate-400">Ready to analyze</p>
              </div>
            </div>
            <button 
              onClick={handleRemoveFile}
              className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* link github */}
      <div className="space-y-2 pt-2 border-t border-slate-50">
        <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-indigo-500" />
          <span>Link Repository GitHub (Opsional)</span>
        </label>
        <p className="text-xs text-slate-400">
          Masukkan tautan repositori publik untuk memperkaya analisis portofolio kode riil Anda.
        </p>
        <input
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/username/nama-repository"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all font-mono"
        />
      </div>
      
      <div className="pt-2">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:bg-slate-200 disabled:text-slate-400"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 fill-current text-amber-300" />
          )}
          <span>Start Analyzing</span>
        </button>
      </div>
    </div>
  )
}

export default InputSkill