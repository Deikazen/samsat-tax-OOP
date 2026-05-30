package com.smartcommunity.pelayanan_masyarakat.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice // Menandakan ini adalah middleware penangkap error global
public class GlobalExceptionHandler {

    // Menangkap DataTidakDitemukanException dan mengembalikan status 404 (Not Found)
    @ExceptionHandler(DataTidakDitemukanException.class)
    public ResponseEntity<Map<String, String>> handleDataNotFound(DataTidakDitemukanException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("pesan", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // Menangkap KredensialTidakValidException dan mengembalikan status 401 (Unauthorized)
    @ExceptionHandler(KredensialTidakValidException.class)
    public ResponseEntity<Map<String, String>> handleKredensialTidakValid(KredensialTidakValidException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("pesan", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    // Menangkap IllegalArgumentException (dari validasi setter OOP di Entity) 
    // dan mengembalikan status 400 (Bad Request)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("pesan", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
