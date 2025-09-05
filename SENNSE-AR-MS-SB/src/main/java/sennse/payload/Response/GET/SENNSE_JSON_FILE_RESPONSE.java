package sennse.payload.Response.GET;

import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Data
public class SENNSE_JSON_FILE_RESPONSE {
    private int id;
    private String boardName;
    private UUID boardUUId;
    private List<HashMap<String, String>> sensorHandled;
}