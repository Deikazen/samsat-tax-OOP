package com.smartcommunity.pelayanan_masyarakat.service;

import com.smartcommunity.pelayanan_masyarakat.model.Admin;
import com.smartcommunity.pelayanan_masyarakat.model.Pengguna;

public interface AuthService {

    Pengguna loginPengguna(Pengguna pengguna);

    Admin loginAdmin(Admin admin);

    Pengguna registerPengguna(Pengguna pengguna);

    Admin registerAdmin(Admin admin);
}
