import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import api from "../services/api";
import { useNavigate, Navigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Kalau sudah login
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = async () => {
    try {
      // Login popup Google Firebase
      const result = await signInWithPopup(auth, googleProvider);

      // Ambil user Firebase
      const user = result.user;

      // Ambil Firebase ID Token
      const idToken = await user.getIdToken();

      console.log("Firebase Token:", idToken);

      // Kirim token ke backend Express
      const response = await api.post("/auth/google", {
        idToken,
      });

      console.log("Backend Response:", response.data);

      // Simpan session
      localStorage.setItem("token", idToken);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );

      // Redirect ke dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("FULL ERROR:", error);

      if (error.response) {
        console.log("Backend Error:", error.response.data);
      }

      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-10">

        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#12162b] rounded-xl mb-4">
            <span className="text-[#6366f1] text-2xl font-bold">S</span>
          </div>

          <h1 className="text-2xl font-bold text-[#12162b]">
            SkillsGap
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            AI Career Navigator
          </p>
        </div>

        {/* Welcome Text */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#12162b]">
            Welcome Back
          </h2>

          <p className="text-gray-400 text-sm">
            Please sign in to continue your journey
          </p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 mb-6"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />

          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>

          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400 font-medium">
              Or limited access
            </span>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-gray-400 mt-8">
          © 2026 SkillsGap AI Platform. <br />
          By signing in, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default Login;