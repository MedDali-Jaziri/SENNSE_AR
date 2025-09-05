package sennse.payload.Response.GET;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class QR_LIST_RESPONSE {

    private String QR_identifier;

    private String URL_QR;
}
