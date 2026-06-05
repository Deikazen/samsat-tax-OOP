import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  Car,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Receipt,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [search, setSearch] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const menuItems = useMemo(() => {
    if (isAdmin) {
      return [
        {
          title: "Dashboard Admin",
          desc: "Ringkasan sistem pajak kendaraan",
          path: "/admin",
          icon: LayoutDashboard,
        },
        {
          title: "Data Masyarakat",
          desc: "Kelola akun wajib pajak",
          path: "/admin/pengguna",
          icon: Users,
        },
        {
          title: "Data Kendaraan",
          desc: "Kelola kendaraan dan pemilik",
          path: "/admin/kendaraan",
          icon: Car,
        },
        {
          title: "Tagihan Pajak",
          desc: "Kelola tagihan dan jatuh tempo",
          path: "/admin/tagihan",
          icon: CreditCard,
        },
        {
          title: "Pengaduan",
          desc: "Kelola pengaduan masyarakat",
          path: "/admin/pengaduan",
          icon: MessageSquare,
        },
        {
          title: "Laporan Pajak",
          desc: "Lihat rekap pembayaran",
          path: "/admin/laporan",
          icon: BarChart3,
        },
      ];
    }

    return [
      {
        title: "Dashboard Masyarakat",
        desc: "Ringkasan layanan pajak Anda",
        path: "/masyarakat",
        icon: LayoutDashboard,
      },
      {
        title: "Kendaraan Saya",
        desc: "Lihat kendaraan yang terdaftar",
        path: "/masyarakat/kendaraan",
        icon: Car,
      },
      {
        title: "Tagihan Saya",
        desc: "Cek tagihan dan bayar pajak",
        path: "/masyarakat/tagihan",
        icon: Receipt,
      },
      {
        title: "Pengaduan Saya",
        desc: "Kirim dan pantau pengaduan",
        path: "/masyarakat/pengaduan",
        icon: MessageSquare,
      },
    ];
  }, [isAdmin]);

  const filteredMenus = menuItems.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.title.toLowerCase().includes(keyword) ||
      item.desc.toLowerCase().includes(keyword)
    );
  });

  const getInitials = () => {
    const name = user?.nama || user?.email || "User";

    return name
      .split(" ")
      .slice(0, 2)
      .map((item) => item.charAt(0).toUpperCase())
      .join("");
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setShowSearchResult(true);
  };

  const openMenu = (path) => {
    navigate(path);
    setSearch("");
    setShowSearchResult(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <header className="tax-navbar">
      <div className="tax-navbar-brand">
        <div className="tax-navbar-logo">
          <ShieldCheck size={21} strokeWidth={2.5} />
        </div>

        <div className="tax-navbar-brand-copy">
          <h2>SAMSAT Digital</h2>
          <p>Integrated Vehicle Tax System</p>
        </div>
      </div>

      <div className="tax-navbar-search-wrap">
        <div className="tax-navbar-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Cari menu layanan..."
            value={search}
            onChange={handleSearch}
            onFocus={() => setShowSearchResult(true)}
          />

          {search && (
            <button
              type="button"
              className="tax-search-clear"
              onClick={() => {
                setSearch("");
                setShowSearchResult(false);
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {showSearchResult && search && (
          <div className="tax-search-dropdown">
            <div className="tax-dropdown-title">Hasil pencarian</div>

            {filteredMenus.length === 0 ? (
              <div className="tax-search-empty">
                Menu tidak ditemukan.
              </div>
            ) : (
              filteredMenus.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    type="button"
                    key={item.path}
                    className="tax-search-item"
                    onClick={() => openMenu(item.path)}
                  >
                    <div className="tax-search-item-icon">
                      <Icon size={18} />
                    </div>

                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.desc}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="tax-navbar-actions">
        <div className="tax-notification-wrap">
          <button
            type="button"
            className="tax-navbar-icon-btn"
            onClick={() => {
              setShowNotification(!showNotification);
              setShowProfile(false);
            }}
          >
            <Bell size={19} />
            <span className="tax-notification-dot" />
          </button>

          {showNotification && (
            <div className="tax-notification-dropdown">
              <div className="tax-dropdown-head">
                <div>
                  <span>Notifikasi</span>
                  <h3>Informasi Sistem</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNotification(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="tax-notification-item">
                <div className="tax-notification-icon success">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>Sistem aktif</strong>
                  <p>Semua layanan dapat digunakan dengan normal.</p>
                </div>
              </div>

              <div className="tax-notification-item">
                <div className="tax-notification-icon info">
                  <Receipt size={18} />
                </div>

                <div>
                  <strong>Pembayaran digital</strong>
                  <p>Cek tagihan dan bukti pembayaran pada menu tagihan.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="tax-profile-wrap">
          <button
            type="button"
            className="tax-navbar-profile"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotification(false);
            }}
          >
            <div className="tax-profile-avatar">{getInitials()}</div>

            <div className="tax-profile-copy">
              <strong>{user?.nama || user?.email || "User"}</strong>
              <span>{isAdmin ? "Administrator" : "Masyarakat"}</span>
            </div>

            <ChevronDown size={16} />
          </button>

          {showProfile && (
            <div className="tax-profile-dropdown">
              <div className="tax-profile-dropdown-head">
                <div className="tax-profile-avatar large">
                  {getInitials()}
                </div>

                <div>
                  <strong>{user?.nama || "User"}</strong>
                  <span>{user?.email || "-"}</span>
                </div>
              </div>

              <div className="tax-profile-role">
                <ShieldCheck size={16} />
                {isAdmin ? "Akses Administrator" : "Akun Masyarakat"}
              </div>

              <button
                type="button"
                className="tax-profile-logout"
                onClick={logout}
              >
                <LogOut size={17} />
                Keluar dari Sistem
              </button>
            </div>
          )}
        </div>

        <button type="button" className="tax-navbar-logout" onClick={logout}>
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;