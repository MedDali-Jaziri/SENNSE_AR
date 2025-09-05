package sennse.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import sennse.model.BoardModel;
import sennse.model.SensorModel;
import sennse.payload.Request.POST.SENNSE_JSON_GENERATOR_REQUEST;
import sennse.payload.Response.GET.BOARD_MODEL_RESPONSE;
import sennse.payload.Response.GET.SENSOR_MODEL_RESPONSE;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@Service
public class JsonGeneratorService {

    @Value("${sennse.json-directory}")
    private String jsonDirectory;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String IMAGE_FOLDER = "uploads/Images"; // must match app.upload.dir

    @Value("${app.upload.dir}")
    private String uploadDir;

    public ResponseEntity<?> jsonGeneratorFile(SENNSE_JSON_GENERATOR_REQUEST sennseJsonGenerator) {
        String projectName = sennseJsonGenerator.getProjectName();
        String projectDescription = sennseJsonGenerator.getProjectDescription();

        ObjectMapper mapper = new ObjectMapper();
        File staticJsonDir = new File("uploads/Json");
        if (!staticJsonDir.exists()) {
            staticJsonDir.mkdirs();
        }

        File jsonFile = new File(staticJsonDir, projectName + ".json");

        BOARD_MODEL_RESPONSE boardModelResponse;

        // Step 1: Load existing file if it exists
        if (jsonFile.exists()) {
            try {
                boardModelResponse = mapper.readValue(jsonFile, BOARD_MODEL_RESPONSE.class);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reading existing JSON");
            }
        } else {
            boardModelResponse = new BOARD_MODEL_RESPONSE();
            boardModelResponse.setProjectName(projectName);
            boardModelResponse.setProjectDescription(projectDescription);
            boardModelResponse.setSensorModelResponseList(new ArrayList<>());
        }

        // Step 2: Loop through boards and add/update SENSOR_MODEL_RESPONSE
        for (BoardModel board : sennseJsonGenerator.getBoardModelList()) {
            List<String> tempOrHum = new ArrayList<>(Arrays.asList("Temp", "Hum"));
            List<HashMap<String, String>> sensorMap = new LinkedList<>();
            boolean exist = true;
            String key = "";
            String value = "";
            String qrCodePath = "";

            for (SensorModel sensor : board.getSensorModelList()) {
                if (sensor.getSensorName().toUpperCase().contains(tempOrHum.get(0).toUpperCase()) ||
                        sensor.getSensorName().toUpperCase().contains(tempOrHum.get(1).toUpperCase())) {

                    int index = this.checkSensorIndex(sensor.getSensorName());
                    HashMap<String, String> sensorKey = new HashMap<>();

                    if (exist && sensor.getSensorName().toUpperCase().contains(tempOrHum.get(index).toUpperCase())) {
                        key = tempOrHum.get(index) + " ";
                        value = sensor.getSensorName() + "_&_";
                        exist = false;
                        tempOrHum.remove(index);
                    } else {
                        key = key + "& " + tempOrHum.get(0) + " " + board.getBoardName();
                        value = value + sensor.getSensorName();
                        sensorKey.put(key, value);
                        sensorMap.add(sensorKey);
                        exist = true;
                        tempOrHum.remove(0);
                    }
                }
                qrCodePath = board.getQrCodePath();
            }
            // ✅ Finalize single unmatched sensor (like just "Temp")
            if (!exist && !value.isEmpty()) {
                HashMap<String, String> sensorKey = new HashMap<>();
                key = key + board.getBoardName();
                value = value.replace("_&_", ""); // cleanup if needed
                sensorKey.put(key, value);
                sensorMap.add(sensorKey);
            }
            // Build new sensorModelResponse
            System.out.println("*******************************************************");
            System.out.println("List of the images detected !!!: " + this.listAllImages());


            SENSOR_MODEL_RESPONSE sensorModelResponse = new SENSOR_MODEL_RESPONSE();
            sensorModelResponse.setBoardName(board.getBoardName());
            sensorModelResponse.setBoardUUId(board.getBoardUUId());
            sensorModelResponse.setSensorHandled(sensorMap);
            sensorModelResponse.setQrCodePath(qrCodePath);

            String finalQrCodePath = qrCodePath;
            int index = IntStream.range(0, this.listAllImages().size())
                    .filter(i -> this.listAllImages().get(i).contains(finalQrCodePath))
                    .findFirst()
                    .orElse(-1);


            System.out.println("The QR CODE is: "+ qrCodePath);
            System.out.println(index);
            sensorModelResponse.setTargetIndex(index);

            // Step 3: Check if this board already exists in the file
            List<SENSOR_MODEL_RESPONSE> existingSensorList = boardModelResponse.getSensorModelResponseList();
            boolean updated = false;
            for (int i = 0; i < existingSensorList.size(); i++) {
                SENSOR_MODEL_RESPONSE existing = existingSensorList.get(i);
                if (existing.getBoardUUId().equals(sensorModelResponse.getBoardUUId())) {
                    existingSensorList.set(i, sensorModelResponse); // update
                    updated = true;
                    break;
                }
            }

            if (!updated) {
                existingSensorList.add(sensorModelResponse); // append new board
            }
        }

        // Step 4: Write updated data back to file
        try {
            String jsonContent = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(boardModelResponse);
            Files.write(jsonFile.toPath(), jsonContent.getBytes());
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "File saved",
                    "url", "/json/" + projectName + ".json"
            ));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving JSON");
        }
    }

    public int checkSensorIndex(String Sensor){
        if (Sensor.contains("Temp")) return 0;
        else return 1;
    }

    private List<String> listAllImages() {
        List<String> imagesList = new ArrayList<>();
        try (Stream<Path> files = Files.list(Paths.get(IMAGE_FOLDER))) {
            files.filter(Files::isRegularFile)
                    .forEach(file -> {
//                        System.out.println(uploadDir + file.getFileName());
                        imagesList.add(uploadDir + file.getFileName());
                    });
        } catch (IOException e) {
            e.printStackTrace();
        }
        return imagesList;
    }

    public Map<String, List<BOARD_MODEL_RESPONSE>> listOfJSONFilesGroupedByProjectName() {
        File folder = new File(jsonDirectory);

        if (!folder.exists() || !folder.isDirectory()) {
            return Map.of(); // Return empty map if invalid folder
        }

        File[] jsonFiles = folder.listFiles((dir, name) -> name.toLowerCase().endsWith(".json"));
        if (jsonFiles == null) return Map.of();

        Map<String, List<BOARD_MODEL_RESPONSE>> groupedByProject = new HashMap<>();

        for (File file : jsonFiles) {
            try {
                // Extract project name from filename
                String projectName = file.getName().replaceFirst("[.][^.]+$", "");

                // Parse single BOARD_MODEL_RESPONSE object (not array)
                BOARD_MODEL_RESPONSE response = objectMapper.readValue(file, BOARD_MODEL_RESPONSE.class);

                System.out.println("Check 1 ***** " +this.listAllImages());
                for (SENSOR_MODEL_RESPONSE sensorModelResponse: response.getSensorModelResponseList()) {
                    String finalQrCodePath = sensorModelResponse.getQrCodePath();
                    int index = IntStream.range(0, this.listAllImages().size())
                            .filter(i -> this.listAllImages().get(i).contains(finalQrCodePath))
                            .findFirst()
                            .orElse(-1);

                    sensorModelResponse.setTargetIndex(index);

                    System.out.println("Original Index: "+sensorModelResponse.getTargetIndex());
                    System.out.println("Check "+sensorModelResponse.getQrCodePath()+" "+index);
                }
                // Put into map as a single-element list
                groupedByProject.put(projectName, List.of(response));
            } catch (IOException e) {
                System.err.println("Failed to parse file: " + file.getName() + " → " + e.getMessage());
            }
        }

        return groupedByProject;
    }
}
