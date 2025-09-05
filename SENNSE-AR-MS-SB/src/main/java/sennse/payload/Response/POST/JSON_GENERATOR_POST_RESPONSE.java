package sennse.payload.Response.POST;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor

public class JSON_GENERATOR_POST_RESPONSE {

    private HttpStatus httpStatus;

    private String message;

    private String fileLocation;

}
