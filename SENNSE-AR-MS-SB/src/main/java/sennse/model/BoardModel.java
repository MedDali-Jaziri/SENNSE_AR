package sennse.model;

import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Data
public class BoardModel {
    private int id;

    private String boardName;

    private String boardDescription;

    private UUID boardUUId;

    private String qrCodePath;

    private List<HashMap<String, String>> sensorHandled ;

    private List<SensorModel> sensorModelList;

}
