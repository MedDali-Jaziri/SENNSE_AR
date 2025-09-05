package sennse.payload.Response.GET;
import lombok.Data;

import javax.lang.model.type.NullType;
import java.util.*;

@Data
public class BOARD_RESPONSE {
    private List<data> data;

    public List<Map<String, Object>> getBoardDetails(){
        List<Map<String, Object>> listDeviceName = new ArrayList<>();
        int index = 0;
        for (data board: data) {
            Map<String, Object> map = new HashMap<>();
            map.put("Board Description", board.getAdditionalInfo().getDescription());
            map.put("Board Name", board.getName());
            map.put("Board UUID", board.getId().getId());
            map.put("ID", index);

            listDeviceName.add(map);
            index++;
        }
        return listDeviceName;
    }
}

@Data
class data{
    private ID id;
    private Long createdTime;

    private Tenant tenantId;

    private Customer customerId;

    private String name;

    private String type;

    private String label;

    private Device deviceProfileId;

    private NullType firmwareId;

    private NullType softwareId;

    private NullType externalId;

    private AdditionalInfo additionalInfo;

    private DeviceData deviceData;

}

@Data
class ID{
    private String entityType;

    private UUID id;

}

@Data
class Tenant{
    private String entityType;
    private UUID id;
}

@Data
class Customer{
    private String entityType;
    private UUID id;
}

@Data
class Device{
    private String entityType;

    private UUID id;
}

@Data
class AdditionalInfo{
    private Boolean gateway;

    private Boolean overwriteActivityTime;

    private String description;
}

@Data
class DeviceData{
    private Configure configuration;

    private TransportConfiguration transportConfiguration;
}

@Data
class Configure{
    private String type;
}

@Data
class TransportConfiguration{
    private String type;
}