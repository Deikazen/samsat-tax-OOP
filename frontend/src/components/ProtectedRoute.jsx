import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Kalau belum login, lempar ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kalau role tidak sesuai, lempar ke dashboard sesuai role
  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "MASYARAKAT") {
      return <Navigate to="/masyarakat" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  // Kalau aman, tampilkan halaman
  return children;
}

export default ProtectedRoute;