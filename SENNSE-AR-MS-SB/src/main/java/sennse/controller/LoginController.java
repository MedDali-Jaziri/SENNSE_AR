package sennse.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import sennse.payload.Request.POST.SENNSE_AUTH_REQUEST;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/sennse-ar")
public class LoginController {

//    @PostMapping("login-to-sennse")
//    public ResponseEntity<String> loginToSENNSE(){
//        SENNSE_AUTH_REQUEST sennseAuthRequest = new SENNSE_AUTH_REQUEST();
//
//        // Create a JSON body
//        Map<String, String> credentials = new HashMap<>();
//        credentials.put("username", sennseAuthRequest.getUsername());
//        credentials.put("password", sennseAuthRequest.getPassword());
//
//        // Set Headers
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        // Combine headers and body into HttpEntity
//        HttpEntity<Map<String, String>> request = new HttpEntity<>(credentials, headers);
//
//        //Send POST Request
//        RestTemplate restTemplate = new RestTemplate();
//        ResponseEntity<String> response = restTemplate.postForEntity(sennseAuthRequest.getSennseURL(), request, String.class);
//        return response;
//    }
}
