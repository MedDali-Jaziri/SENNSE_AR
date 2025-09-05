package sennse.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import sennse.component.SENNSE_URL;

import java.io.File;
import java.util.List;


@Service
public class SennseTargetGeneratorService {

    @Autowired
    private SENNSE_URL sennseUrl;

    @Autowired
    private RestTemplate restTemplate;

    public void getImagesTarget(List<String> imagesPath) throws Exception{
        // Prepare Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        for (String path: imagesPath){
            File file = new File(path);
            if(file.exists() && file.isFile()){
                body.add("images", new FileSystemResource(file));
            }
            else{
                System.err.println("File not found or not a file: " + path);
            }

        }
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> restTemplate = this.restTemplate.postForEntity(
                this.sennseUrl.getSennseImageCompilerURL() + "/api/sennse-target-generator",
                requestEntity,
                String.class
        );

        System.out.println("Response: " + restTemplate.getBody());
    }

}