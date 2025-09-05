package sennse.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import sennse.component.SENNSE_URL;
import sennse.component.TokenStore;
import sennse.payload.Request.POST.SENNSE_AUTH_REQUEST;
import sennse.payload.Response.POST.SENNSE_AUTH_RESPONSE;

import java.util.HashMap;
import java.util.Map;

@Service
public class SennseAuthService {

    @Autowired
    private TokenStore tokenStore;

    @Autowired
    private SENNSE_URL sennseUrl;

    public ResponseEntity<SENNSE_AUTH_RESPONSE> loginToSENNSE(){
        SENNSE_AUTH_REQUEST sennseAuthRequest = new SENNSE_AUTH_REQUEST();

        // Create a JSON body
        Map<String, String> credentials = new HashMap<>();
        credentials.put("username", sennseAuthRequest.getUsername());
        credentials.put("password", sennseAuthRequest.getPassword());

        // Set Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Combine headers and body into HttpEntity
        HttpEntity<Map<String, String>> request = new HttpEntity<>(credentials, headers);

        //Send POST Request
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<SENNSE_AUTH_RESPONSE> response = restTemplate.postForEntity(
                    sennseUrl.getSennseURL()+"/api/auth/login", request, SENNSE_AUTH_RESPONSE.class);
            String token = response.getBody().getToken();
            System.out.println("Token value: "+ token);
            tokenStore.setToken(token);

            return response;
        } catch (Exception ex) {
            System.err.println("Login failed: " + ex.getMessage());
            return null;
        }
    }
}

