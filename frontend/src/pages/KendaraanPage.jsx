import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function KendaraanPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [listKendaraan, setListKendaraan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKendaraan();
  }, []);

  const getKendaraan = async () => {
    try {
      let response;

      if (user?.role === "MASYARAKAT" && user?.nik) {
        response = await api.get(`/kendaraan/nik/${user.nik}`);
      } else {
        response = await api.get("/kendaraan");
      }

      console.log("DATA KENDARAAN:", response.data);

      if (Array.isArray(response.data)) {
        setListKendaraan(response.data);
      } else {
        setListKendaraan([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data kendaraan:", error);
      alert("Gagal mengambil data kendaraan dari backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="content">
          <div className="page-header">
            <div>
              <h1>Data Kendaraan</h1>
              <p>Data kendaraan yang terdaftar dari backend Spring Boot.</p>
            </div>
          </div>

          {loading ? (
            <div className="summary-card">
              <p>Loading data kendaraan...</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Plat Nomor</th>
                  <th>Merek</th>
                  <th>Pemilik</th>
                  <th>Email Pemilik</th>
                  <th>NIK</th>
                </tr>
              </thead>

              <tbody>
                {listKendaraan.length === 0 ? (
                  <tr>
                    <td colSpan="6">Belum ada data kendaraan.</td>
                  </tr>
                ) : (
                  listKendaraan.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td>
                      <td>{item.platNomor || "-"}</td>
                      <td>{item.merek || "-"}</td>
                      <td>{item.pengguna?.nama || "-"}</td>
                      <td>{item.pengguna?.email || "-"}</td>
                      <td>{item.pengguna?.nik || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
}

export default KendaraanPage;