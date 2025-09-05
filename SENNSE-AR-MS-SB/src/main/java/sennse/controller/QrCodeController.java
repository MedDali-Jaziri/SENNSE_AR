package sennse.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sennse.payload.Request.POST.QR_CODE_REQUEST;
import sennse.payload.Response.GET.QR_LIST_RESPONSE;
import sennse.services.QrCodeService;

import java.io.File;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/sennse-ar")
public class QrCodeController {

    @Autowired
    private QrCodeService qrCodeService;

    @PostMapping(value = "qr-code-generate", consumes = "multipart/form-data")
    public ResponseEntity<Resource> generateQrCode(
            @RequestParam("data") String data,
            @RequestParam("logoPath") MultipartFile logoFile){
        try {
            System.out.println("**** --- Generate QR Code Controller --- ****");

            File tempLogo = File.createTempFile("logoPath", logoFile.getOriginalFilename());
            logoFile.transferTo(tempLogo);

            System.out.println(data);
            System.out.println(tempLogo.getAbsolutePath());

            QR_CODE_REQUEST qrCodeRequest = new QR_CODE_REQUEST(data, tempLogo.getAbsolutePath());


            return this.qrCodeService.generateQrCodeWithLogo(qrCodeRequest);
        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "qr-code-list")
    public List<QR_LIST_RESPONSE> listStoredBoardController(){
        try {
            return this.qrCodeService.getListOfQrCode();
        }
        catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
}