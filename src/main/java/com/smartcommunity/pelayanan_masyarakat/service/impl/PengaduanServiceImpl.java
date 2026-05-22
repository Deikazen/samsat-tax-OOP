package com.smartcommunity.pelayanan_masyarakat.service.impl;

import com.smartcommunity.pelayanan_masyarakat.exception.DataTidakDitemukanException;
import com.smartcommunity.pelayanan_masyarakat.model.Pengaduan;
import com.smartcommunity.pelayanan_masyarakat.repository.PengaduanRepository;
import com.smartcommunity.pelayanan_masyarakat.service.PengaduanService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PengaduanServiceImpl implements PengaduanService {

    private final PengaduanRepository pengaduanRepo;

    public PengaduanServiceImpl(PengaduanRepository pengaduanRepo) {
        this.pengaduanRepo = pengaduanRepo;
    }

    @Override
    public Pengaduan ajukanPengaduan(Pengaduan pengadu) {
        // Objek pengadu diasumsikan sudah berisi relasi Pengguna dan Kategori dari Controller
        return pengaduanRepo.save(pengadu);
    }

    @Override
    public List<Pengaduan> getAllPengaduan() {
        return pengaduanRepo.findAll();
    }

    @Override
    public Pengaduan getPengaduanById(Long id) {
        return pengaduanRepo.findById(id)
                .orElseThrow(() -> new DataTidakDitemukanException("Pengaduan dengan ID " + id + " tidak ditemukan!"));
    }

    @Override
    public void updateStatusPengaduan(Long id, String status) {
        Pengaduan pengaduan = getPengaduanById(id);
        pengaduan.setStatus(status); // Menggunakan setter dari prinsip Encapsulation
        pengaduanRepo.save(pengaduan);
    }
}
