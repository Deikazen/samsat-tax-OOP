import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function PenggunaPage() {
  const userLogin = JSON.parse(localStorage.getItem("user"));

  const [tabAktif, setTabAktif] = useState("MASYARAKAT");
  const [listData, setListData] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nik, setNik] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noHp, setNoHp] = useState("");

  const [nip, setNip] = useState("");

  useEffect(() => {
    getData();
  }, [tabAktif]);

  const isAdminTab = tabAktif === "ADMIN";

  const getData = async () => {
    try {
      setLoading(true);

      const endpoint = isAdminTab ? "/admin" : "/pengguna";

      const response = await api.get(endpoint);

      setListData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Gagal mengambil data akun:", error);
      alert("Gagal mengambil data akun dari backend.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNama("");
    setEmail("");
    setPassword("");

    setNik("");
    setAlamat("");
    setNoHp("");

    setNip("");

    setEditId(null);
  };

  const tutupForm = () => {
    resetForm();
    setShowForm(false);
  };

  const bukaFormTambah = () => {
    resetForm();
    setShowForm(true);
  };

  const bukaFormEdit = (item) => {
    setEditId(item.id);

    setNama(item.nama || "");
    setEmail(item.email || "");
    setPassword("");

    setNik(item.nik || "");
    setAlamat(item.alamat || "");
    setNoHp(item.noHp || "");

    setNip(item.nip || "");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const simpanData = async (event) => {
    event.preventDefault();

    if (!nama || !email) {
      alert("Nama dan email wajib diisi.");
      return;
    }

    if (!editId && !password) {
      alert("Password wajib diisi untuk akun baru.");
      return;
    }

    if (password && password.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }

    if (isAdminTab && !nip) {
      alert("NIP wajib diisi.");
      return;
    }

    if (!isAdminTab && (!nik || nik.length !== 16)) {
      alert("NIK masyarakat harus tepat 16 digit.");
      return;
    }

    const payload = isAdminTab
      ? {
          nama,
          email,
          password,
          nip,
        }
      : {
          nama,
          email,
          password,
          nik,
          alamat,
          noHp,
        };

    try {
      setSaving(true);

      const endpoint = isAdminTab ? "/admin" : "/pengguna";

      if (editId) {
        await api.put(`${endpoint}/${editId}`, payload);
      } else {
        await api.post(endpoint, payload);
      }

      alert(
        `${isAdminTab ? "Admin" : "Masyarakat"} berhasil ${
          editId ? "diperbarui" : "ditambahkan"
        }.`
      );

      tutupForm();
      await getData();
    } catch (error) {
      console.error("Gagal menyimpan akun:", error);

      alert(
        error?.response?.data?.pesan ||
          "Gagal menyimpan akun. Periksa kembali data yang dimasukkan."
      );
    } finally {
      setSaving(false);
    }
  };

  const hapusData = async (item) => {
    if (isAdminTab && item.id === userLogin?.id) {
      alert("Akun admin yang sedang digunakan tidak boleh dihapus.");
      return;
    }

    const konfirmasi = confirm(
      `Yakin ingin menghapus akun ${item.nama}?`
    );

    if (!konfirmasi) {
      return;
    }

    try {
      const endpoint = isAdminTab ? "/admin" : "/pengguna";

      await api.delete(`${endpoint}/${item.id}`);

      alert(
        `${isAdminTab ? "Admin" : "Masyarakat"} berhasil dihapus.`
      );

      await getData();
    } catch (error) {
      console.error("Gagal menghapus akun:", error);

      alert(
        error?.response?.data?.pesan ||
          "Gagal menghapus akun."
      );
    }
  };

  const gantiTab = (tab) => {
    setTabAktif(tab);
    tutupForm();
  };

  return (
    <div>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="content">
          <div className="page-header">
            <div>
              <h1>Kelola Data Akun</h1>

              <p>
                Kelola akun masyarakat dan administrator SAMSAT Digital.
              </p>
            </div>

            <button type="button" onClick={bukaFormTambah}>
              + Tambah Data
            </button>
          </div>

          <div className="account-tabs">
            <button
              type="button"
              className={tabAktif === "MASYARAKAT" ? "active" : ""}
              onClick={() => gantiTab("MASYARAKAT")}
            >
              Data Masyarakat
            </button>

            <button
              type="button"
              className={tabAktif === "ADMIN" ? "active" : ""}
              onClick={() => gantiTab("ADMIN")}
            >
              Data Admin
            </button>
          </div>

          {showForm && (
            <form className="form-card account-form" onSubmit={simpanData}>
              <div className="account-form-heading">
                <h3>
                  {editId ? "Edit" : "Tambah"} Data{" "}
                  {isAdminTab ? "Admin" : "Masyarakat"}
                </h3>

                <button
                  type="button"
                  className="account-close-form"
                  onClick={tutupForm}
                >
                  Tutup Form
                </button>
              </div>

              <div className="account-form-grid">
                <label>
                  <span>Nama Lengkap</span>

                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={nama}
                    onChange={(event) =>
                      setNama(event.target.value)
                    }
                  />
                </label>

                <label>
                  <span>Email</span>

                  <input
                    type="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                  />
                </label>

                <label>
                  <span>
                    Password {editId && "(kosongkan jika tidak diubah)"}
                  </span>

                  <input
                    type="password"
                    placeholder={
                      editId
                        ? "Tidak perlu diisi jika tidak diubah"
                        : "Minimal 6 karakter"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                  />
                </label>

                {isAdminTab ? (
                  <label>
                    <span>NIP</span>

                    <input
                      type="text"
                      placeholder="Masukkan NIP admin"
                      value={nip}
                      onChange={(event) =>
                        setNip(event.target.value)
                      }
                    />
                  </label>
                ) : (
                  <>
                    <label>
                      <span>NIK</span>

                      <input
                        type="text"
                        placeholder="Masukkan NIK 16 digit"
                        maxLength="16"
                        value={nik}
                        onChange={(event) =>
                          setNik(event.target.value)
                        }
                      />
                    </label>

                    <label>
                      <span>Alamat</span>

                      <input
                        type="text"
                        placeholder="Masukkan alamat"
                        value={alamat}
                        onChange={(event) =>
                          setAlamat(event.target.value)
                        }
                      />
                    </label>

                    <label>
                      <span>No HP</span>

                      <input
                        type="text"
                        placeholder="Masukkan nomor HP"
                        value={noHp}
                        onChange={(event) =>
                          setNoHp(event.target.value)
                        }
                      />
                    </label>
                  </>
                )}
              </div>

              <button type="submit" disabled={saving}>
                {saving
                  ? "Menyimpan..."
                  : editId
                    ? "Simpan Perubahan"
                    : "Simpan Data"}
              </button>
            </form>
          )}

          {loading ? (
            <div className="summary-card">
              <p>Loading data akun...</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Email</th>

                  {isAdminTab ? (
                    <th>NIP</th>
                  ) : (
                    <>
                      <th>NIK</th>
                      <th>Alamat</th>
                      <th>No HP</th>
                    </>
                  )}

                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {listData.length === 0 ? (
                  <tr>
                    <td colSpan={isAdminTab ? "5" : "7"}>
                      Belum ada data {isAdminTab ? "admin" : "masyarakat"}.
                    </td>
                  </tr>
                ) : (
                  listData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.nama}</td>
                      <td>{item.email}</td>

                      {isAdminTab ? (
                        <td>{item.nip || "-"}</td>
                      ) : (
                        <>
                          <td>{item.nik || "-"}</td>
                          <td>{item.alamat || "-"}</td>
                          <td>{item.noHp || "-"}</td>
                        </>
                      )}

                      <td>
                        <div className="account-action-buttons">
                          <button
                            type="button"
                            className="btn-edit"
                            onClick={() => bukaFormEdit(item)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => hapusData(item)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
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

export default PenggunaPage;