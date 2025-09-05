package sennse.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import sennse.component.SENNSE_URL;
import sennse.component.SennseBoardStore;
import sennse.component.TokenStore;
import sennse.model.BoardModel;
import sennse.model.SensorModel;
import sennse.payload.Request.GET.BOARD_REQUEST;
import sennse.payload.Response.GET.BOARD_RESPONSE;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@Service
public class BoardsService {
    @Autowired
    private TokenStore tokenStore;

    @Autowired
    private SENNSE_URL sennseUrl;

    @Autowired
    private SennseBoardStore sennseBoardStore;

    public ResponseEntity<BOARD_RESPONSE> listOfBoard(){
        BOARD_REQUEST boardRequest = new BOARD_REQUEST();
        boardRequest.setPageSize("30");
        boardRequest.setPage("0");
        String token = tokenStore.getToken();

        if (token == null){
            System.out.println("No token available !!");
        }

        // 1. Build the URL parameters
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(sennseUrl.getSennseURL()+"/api/tenant/devices")
                .queryParam("pageSize", boardRequest.getPageSize())
                .queryParam("page", boardRequest.getPage());

        String urlWithParameters = builder.toUriString();

        // 2. Set Authorization header
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Make GET  Request
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<BOARD_RESPONSE> response = restTemplate.exchange(
                    urlWithParameters,
                    HttpMethod.GET,
                    entity,
                    BOARD_RESPONSE.class
            );
            List<BoardModel> sennseBoardStores = new ArrayList<>();
            BoardModel sennseBoard;
            List<SensorModel> sensorList;

            for (Map<String, Object> device: response.getBody().getBoardDetails()) {
                sennseBoard = new BoardModel();

                sennseBoard.setId((int) device.get("ID"));
                sennseBoard.setBoardDescription((String) device.get("Board Description"));
                sennseBoard.setBoardName((String) device.get("Board Name"));
                sennseBoard.setBoardUUId((UUID) device.get("Board UUID"));

                sensorList = this.listOfSensor((UUID) device.get("Board UUID"));
                sennseBoard.setSensorModelList(sensorList);

                sennseBoardStores.add(sennseBoard);
            }
            sennseBoardStore.setSennseBoardStores(sennseBoardStores);

            return response;

        } catch (Exception ex) {
            System.err.println("Get Board List failed: " + ex.getMessage());
            return null;
        }
    }

    public List<SensorModel> listOfSensor(UUID boardUUId){
        String token = tokenStore.getToken();

        if (token == null){
            System.out.println("No token available !!");
        }

        // 1. Build the URL parameters
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(sennseUrl.getSennseURL()+"/api/plugins/telemetry/DEVICE/"+ boardUUId.toString()+"/keys/timeseries");

        String urlWithParameters = builder.toUriString();

        // 2. Set Authorization header
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Make GET  Request
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    urlWithParameters,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            // Parse JSON array string to List<String>
            ObjectMapper objectMapper = new ObjectMapper();
            List<String> sensorList = objectMapper.readValue(response.getBody(), List.class);

            SensorModel sensorModel;
            List<SensorModel> sensorModelList = new ArrayList<>();
            int index = 0;
            for (String sensor: sensorList) {
                sensorModel = new SensorModel();
                sensorModel.setSensorId(index);
                sensorModel.setSensorName(sensor);
                sensorModel.setSensorDescription(sensor);

                sensorModelList.add(sensorModel);
                index++;
            }
            return sensorModelList; // Or return sensorList if you want to return as List

        } catch (Exception ex) {
            System.err.println("Get Board List failed: " + ex.getMessage());
            return null;
        }
    }
    public List<BoardModel> listStoredBoard(){
        return sennseBoardStore.getSennseBoardStores();
    }
}
