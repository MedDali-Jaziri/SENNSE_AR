package sennse.payload.Response.GET;

import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Data
public class SENSOR_MODEL_RESPONSE{
    private int id;

    private String boardName;

    private UUID boardUUId;

    private String qrCodePath;

    private int targetIndex;

    private List<HashMap<String, String>> sensorHandled ;
}
