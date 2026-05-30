import { Link } from "react-router-dom";
import { Car, LogIn, ShieldCheck } from "lucide-react";

function LandingNavbar() {
  return (
    <header className="landing-navbar">
      <Link to="/" className="landing-brand">
        <div className="landing-logo">
          <ShieldCheck size={22} />
        </div>

        <div>
          <h2>SAMSAT Digital</h2>
          <p>Vehicle Tax Service</p>
        </div>
      </Link>

      <nav className="landing-nav-menu">
        <a href="#layanan">Layanan</a>
        <a href="#alur">Alur Pajak</a>
        <a href="#denda">Denda</a>
        <a href="#faq">FAQ</a>
      </nav>

      <div className="landing-nav-actions">
        <Link to="/register" className="landing-register-btn">
          Daftar
        </Link>

        <Link to="/login" className="landing-login-btn">
          <LogIn size={17} />
          Login
        </Link>
      </div>

      <Car className="landing-nav-car" size={26} />
    </header>
  );
}

export default LandingNavbar;