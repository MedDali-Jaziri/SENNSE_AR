package sennse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sennse.payload.Request.POST.SENNSE_JSON_GENERATOR_REQUEST;
import sennse.payload.Response.GET.BOARD_MODEL_RESPONSE;
import sennse.services.JsonGeneratorService;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/sennse-ar")
public class JsonGenerator {

    @Autowired
    private JsonGeneratorService jsonGeneratorService;

    @PostMapping("json-generator-file")
    public ResponseEntity<?> jsonGeneratorFile(@RequestBody SENNSE_JSON_GENERATOR_REQUEST sennseJsonGenerator){
        System.out.println("***** Enter to this JSON Generator File !!!");
        System.out.println(sennseJsonGenerator);
        return this.jsonGeneratorService.jsonGeneratorFile(sennseJsonGenerator);
    }

    @GetMapping("list-of-files")
    public Map<String, List<BOARD_MODEL_RESPONSE>> listOfJsonFiles(){
        return this.jsonGeneratorService.listOfJSONFilesGroupedByProjectName();
    }
}
