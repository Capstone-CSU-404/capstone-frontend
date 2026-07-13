import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import api from "../services/api";
import { useNavigate, Navigate } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";

const AppLogo = ({ className = "w-10 h-10" }) => (
  <div className={`flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 rounded-xl ${className}`}>
    <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await api.post("/auth/google", { idToken });
    

      const { tokens, user: backendUser } = response.data.data;

      localStorage.setItem("token", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(backendUser));

      navigate("/dashboard");
    } catch (error) {
      console.error("FULL ERROR:", error);
      alert(error.response?.data?.message || error.message || "Gagal masuk menggunakan Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white font-sans antialiased selection:bg-indigo-500 selection:text-white">

      <div className="hidden lg:flex lg:col-span-5 bg-[#0b0f19] relative overflow-hidden flex-col justify-between p-12 border-r border-slate-800/20">
        {/* Glow Effect */}
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-3.5 relative z-10">
          <AppLogo />
          <div className="flex flex-col">
            <span className="text-white font-bold text-base tracking-wide leading-tight">
              AI Skill & Career Pathway
            </span>
            <span className="text-slate-400 font-medium text-xs tracking-wider uppercase mt-0.5">
              Analyzer
            </span>
          </div>
        </div>

        {/* Promo Pitch Tengah */}
        <div className="space-y-6 relative z-10 my-auto max-w-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Next-Gen Career Mapping
          </div>
          <h2 className="text-3xl font-extrabold text-white leading-snug">
            Bridge the gap between where you are and{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              where you want to be.
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Upload your CV, instantly extract core skills, and map out your optimal path with precision AI.
          </p>
        </div>

        {/* Footer Kiri */}
        <p className="text-xs text-slate-600 relative z-10 font-medium tracking-wide">
          Enterprise Grade Security • Powered by AI
        </p>
      </div>

      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 bg-white">

        <div className="max-w-md w-full bg-indigo-950 rounded-2xl border border-indigo-900/60 p-8 sm:p-10 shadow-[0_25px_50px_-12px_rgba(30,27,75,0.25)] transition-all">

          <div className="text-center lg:hidden mb-10">
            <div className="inline-flex items-center justify-center mb-4">
              <AppLogo className="w-12 h-12" />
            </div>
            <h1 className="text-xl font-black text-white tracking-wide">
              AI Skill & Career Pathway
            </h1>
            <p className="text-indigo-300 text-xs uppercase tracking-widest font-semibold mt-1">
              Analyzer
            </p>
          </div>

          {/* Welcome Text */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-indigo-200/70 text-sm mt-1.5">Sign in with your Google account to get started</p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-indigo-900/60 hover:bg-indigo-900 border border-indigo-700/50 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200 mb-6 shadow-md group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            ) : (
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 group-hover:scale-105 transition-transform"
              />
            )}
            <span className="text-sm">{isLoading ? "Verifying account..." : "Continue with Google"}</span>
          </button>

          {/* Minimal Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-indigo-900"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-indigo-950 px-3 text-indigo-400 font-semibold tracking-widest text-[9px]">
                Secure Authentication
              </span>
            </div>
          </div>

          {/* Bottom Notice */}
          <div className="text-center text-[11px] text-indigo-400/60 mt-8">
            <p>© 2026 AI Skill & Career Pathway Analyzer.</p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;