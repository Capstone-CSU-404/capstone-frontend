import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Kalau belum login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Kalau sudah login
  return children;
};

export default ProtectedRoute;