package sennse.payload.Request.POST;

import lombok.Data;
@Data
public class QR_CODE_REQUEST {
    private String data;

    private String logoPath;

    public QR_CODE_REQUEST(String data, String logoPath){
        this.data = data;
        this.logoPath = logoPath;
    }
}
