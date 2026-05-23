import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div>
        <h2>SAMSAT Digital</h2>
        <p>Sistem Informasi Pajak Kendaraan Bermotor</p>
      </div>

      <div className="navbar-right">
        <span>{user?.nama || user?.email || "User"}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;