package sennse.payload.Request.POST;

import lombok.Data;
import sennse.model.BoardModel;
import sennse.model.SensorModel;

import java.util.*;

@Data
public class SENNSE_JSON_GENERATOR_REQUEST {

    private String projectName;

    private String projectDescription;

    private List<BoardModel> boardModelList;

    private List<SensorModel> sensorModelList;
}