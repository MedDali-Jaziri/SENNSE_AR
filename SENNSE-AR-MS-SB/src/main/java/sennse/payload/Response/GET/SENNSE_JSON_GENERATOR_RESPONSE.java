package sennse.payload.Response.GET;

import lombok.AllArgsConstructor;
import lombok.Data;
import sennse.model.BoardModel;
import sennse.model.SensorModel;

import java.util.List;

@Data
@AllArgsConstructor
public class SENNSE_JSON_GENERATOR_RESPONSE {
    private String projectName;
    private List<BoardModel> boardModelList;
    private List<SensorModel> sensorModelList;

}
