package sennse.component;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class SENNSE_URL {

    private String sennseURL = "https://sennse.ispc.cnr.it";

    private String sennseImageCompilerURL = "https://3d.sennse.ispc.cnr.it/sennse-ar/node/";
}

