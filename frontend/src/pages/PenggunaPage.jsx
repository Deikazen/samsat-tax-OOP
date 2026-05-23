import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { pengguna } from "../data/dummyData";

function PenggunaPage() {
  const [listPengguna, setListPengguna] = useState(pengguna);
  const [showForm, setShowForm] = useState(false);

  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noHp, setNoHp] = useState("");

  const tambahPengguna = (e) => {
    e.preventDefault();

    if (!nama || !nik || !alamat || !noHp) {
      alert("Semua data wajib diisi");
      return;
    }

    const newPengguna = {
      id: listPengguna.length + 1,
      nama,
      nik,
      alamat,
      noHp,
    };

    setListPengguna([...listPengguna, newPengguna]);

    setNama("");
    setNik("");
    setAlamat("");
    setNoHp("");
    setShowForm(false);
  };

  const hapusPengguna = (id) => {
    const konfirmasi = confirm("Yakin ingin menghapus data ini?");

    if (konfirmasi) {
      const dataBaru = listPengguna.filter((item) => item.id !== id);
      setListPengguna(dataBaru);
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
              <h1>Kelola Data Masyarakat</h1>
              <p>Data masyarakat atau wajib pajak yang terdaftar.</p>
            </div>

            <button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Tutup Form" : "+ Tambah Data"}
            </button>
          </div>

          {showForm && (
            <form className="form-card" onSubmit={tambahPengguna}>
              <h3>Tambah Data Masyarakat</h3>

              <label>Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />

              <label>NIK</label>
              <input
                type="text"
                placeholder="Masukkan NIK"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
              />

              <label>Alamat</label>
              <input
                type="text"
                placeholder="Masukkan alamat"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
              />

              <label>No HP</label>
              <input
                type="text"
                placeholder="Masukkan nomor HP"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
              />

              <button type="submit">Simpan Data</button>
            </form>
          )}

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIK</th>
                <th>Alamat</th>
                <th>No HP</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {listPengguna.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.nama}</td>
                  <td>{item.nik}</td>
                  <td>{item.alamat}</td>
                  <td>{item.noHp}</td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => hapusPengguna(item.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}

export default PenggunaPage;