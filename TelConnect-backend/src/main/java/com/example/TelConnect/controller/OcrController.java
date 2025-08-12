package com.example.TelConnect.controller;

import com.example.TelConnect.service.OcrService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name= "OCR", description = "OCR operations")
@RestController
@RequestMapping("/api/ocr")
public class OcrController {

    private final OcrService ocrService;

    @Autowired
    public OcrController(OcrService ocrService) {
        this.ocrService = ocrService;
    }

    @PostMapping("/recognize")
    public ResponseEntity<String> recognizeText(@RequestParam("file") MultipartFile file) {
        try {
            String response = ocrService.recognizeText(file.getInputStream());


            if ("verified".equals(response)) {
                return ResponseEntity.ok("Customer verified");
            } else if ("not_verified".equals(response)) {
                return ResponseEntity.status(404).body("Customer not verified");
            } else {
                return ResponseEntity.status(500).body("Unexpected response");
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to process the file");
        }
    }
}