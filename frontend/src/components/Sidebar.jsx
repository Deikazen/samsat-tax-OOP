import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Car,
  CreditCard,
  Home,
  MessageSquare,
  Receipt,
  ShieldCheck,
  Users,
} from "lucide-react";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const adminMenus = [
    { to: "/admin", label: "Dashboard", icon: Home },
    { to: "/admin/pengguna", label: "Data Masyarakat", icon: Users },
    { to: "/admin/kendaraan", label: "Data Kendaraan", icon: Car },
    { to: "/admin/tagihan", label: "Tagihan Pajak", icon: CreditCard },
    { to: "/admin/pengaduan", label: "Pengaduan", icon: MessageSquare },
    { to: "/admin/laporan", label: "Laporan Pajak", icon: BarChart3 },
  ];

  const masyarakatMenus = [
    { to: "/masyarakat", label: "Dashboard", icon: Home },
    { to: "/masyarakat/kendaraan", label: "Kendaraan Saya", icon: Car },
    { to: "/masyarakat/tagihan", label: "Tagihan Saya", icon: Receipt },
    { to: "/masyarakat/pengaduan", label: "Pengaduan Saya", icon: MessageSquare },
  ];

  const menus = user?.role === "ADMIN" ? adminMenus : masyarakatMenus;

  return (
    <aside className="premium-sidebar">
      <div className="sidebar-card-3d">
        <div className="sidebar-chip">
          <ShieldCheck size={18} />
        </div>

        <p>SAMSAT Access</p>
        <h3>{user?.role === "ADMIN" ? "Admin Control" : "Citizen Portal"}</h3>
        <span>{user?.nama || "Digital User"}</span>
      </div>

      <nav className="sidebar-menu">
        <p className="sidebar-title">Main Navigation</p>

        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin" || item.to === "/masyarakat"}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-mini-info">
        <span>Status Sistem</span>
        <strong>Online</strong>
      </div>
    </aside>
  );
}

export default Sidebar;