import { Link } from "react-router-dom";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="sidebar">
      <h3>Navigation</h3>

      {user?.role === "ADMIN" && (
        <>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/pengguna">Data Masyarakat</Link>
          <Link to="/admin/kendaraan">Data Kendaraan</Link>
          <Link to="/admin/tagihan">Tagihan Pajak</Link>
          <Link to="/admin/pengaduan">Pengaduan</Link>
          <Link to="/admin/laporan">Laporan Pajak</Link>
        </>
      )}

      {user?.role === "MASYARAKAT" && (
        <>
          <Link to="/masyarakat">Dashboard</Link>
          <Link to="/masyarakat/kendaraan">Kendaraan Saya</Link>
          <Link to="/masyarakat/tagihan">Tagihan Saya</Link>
          <Link to="/masyarakat/pengaduan">Pengaduan Saya</Link>
        </>
      )}
    </div>
  );
}

export default Sidebar;