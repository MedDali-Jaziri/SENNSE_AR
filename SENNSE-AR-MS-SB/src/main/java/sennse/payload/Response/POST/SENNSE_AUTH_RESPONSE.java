package sennse.payload.Response.POST;

import lombok.Data;

@Data
public class SENNSE_AUTH_RESPONSE {

    private String token;

    private String refreshToken;
}