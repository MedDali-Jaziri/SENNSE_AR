package sennse.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.core.io.Resource;
import sennse.component.ImageDetective;
import sennse.payload.Request.POST.QR_CODE_REQUEST;
import sennse.payload.Response.GET.QR_LIST_RESPONSE;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;
import java.util.List;

@Service
public class QrCodeService {

    @Autowired
    private ImageDetective imageDetective;

    private static final String IMAGE_FOLDER = "uploads/Images"; // must match app.upload.dir

    @Value("${app.upload.dir}")
    private String uploadDir;
    public ResponseEntity<Resource> generateQrCodeWithLogo(QR_CODE_REQUEST qrCodeRequest) throws IOException, WriterException {
        int size = 500;

        BufferedImage qrImage = generateCustomQrCode(qrCodeRequest.getData(), size, qrCodeRequest.getLogoPath());

        String outputPath = "uploads/Images/" + qrCodeRequest.getData() + ".png";
        File outputDir = new File("uploads/Images/");
        if (!outputDir.exists()) outputDir.mkdirs();

        ImageIO.write(qrImage, "png", new File(outputPath));


        Resource resource = new FileSystemResource(outputPath);

        if (resource.exists() && resource.isReadable()){
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(resource);
        }
        else {
            System.out.println("Failed Operation !!");
            return ResponseEntity.notFound().build();
        }

    }


    public BufferedImage generateCustomQrCode(String data, int size, String logoPath) throws WriterException, IOException {
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
        hints.put(EncodeHintType.MARGIN, 1);

        BitMatrix matrix = new MultiFormatWriter().encode(data, BarcodeFormat.QR_CODE, size, size, hints);

        BufferedImage qrImage = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2 = qrImage.createGraphics();

        // Fill background white
        g2.setColor(Color.WHITE);
        g2.fillRect(0, 0, size, size);

        // Draw colored QR dots
        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                if (matrix.get(x, y)) {
                    g2.setColor(new Color(0, 0, 0));
                    g2.fillRect(x, y, 1, 1);
                }
            }
        }

        // Load logo
        BufferedImage logo = ImageIO.read(new File(logoPath));
        int logoSize = size / 4;
        Image scaledLogo = logo.getScaledInstance(logoSize, logoSize, Image.SCALE_SMOOTH);

        int x = (size - logoSize) / 2;
        int y = (size - logoSize) / 2;

        g2.drawImage(scaledLogo, x, y, null);
        g2.dispose();

        return qrImage;
    }

    public List<QR_LIST_RESPONSE> getListOfQrCode() {

        List<QR_LIST_RESPONSE> qrListResponseList = new ArrayList<QR_LIST_RESPONSE>();

        try (Stream<Path> files = Files.list(Paths.get(IMAGE_FOLDER))) {
            files.filter(Files::isRegularFile)
                    .forEach(file -> {
                        QR_LIST_RESPONSE qrListResponse = new QR_LIST_RESPONSE();
                        String fileName = file.getFileName().toString();
                        int dotIndex = fileName.lastIndexOf('.');
                        String nameWithoutExt = (dotIndex == -1) ? fileName : fileName.substring(0, dotIndex);
                        qrListResponse.setQR_identifier(nameWithoutExt);

                        String cleanedUploadDir = uploadDir.replace("/app", "");
                        qrListResponse.setURL_QR(cleanedUploadDir + file.getFileName());
                        qrListResponseList.add(qrListResponse);
                    });
        } catch (IOException e) {
            e.printStackTrace();
        }
        return qrListResponseList;
    }

}
