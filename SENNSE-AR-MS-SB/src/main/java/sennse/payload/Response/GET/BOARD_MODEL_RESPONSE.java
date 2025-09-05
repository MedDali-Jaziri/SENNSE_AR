package sennse.payload.Response.GET;

import lombok.Data;

import java.util.List;

@Data
public class BOARD_MODEL_RESPONSE {
    private String projectName;

    private String projectDescription;

    private List<SENSOR_MODEL_RESPONSE> sensorModelResponseList;

}
