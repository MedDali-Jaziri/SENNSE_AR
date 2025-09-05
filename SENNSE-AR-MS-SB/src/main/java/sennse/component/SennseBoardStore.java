package sennse.component;

import lombok.Data;
import org.springframework.stereotype.Component;
import sennse.model.BoardModel;

import java.util.ArrayList;
import java.util.List;

@Component
@Data
public class SennseBoardStore {

    private List<BoardModel> sennseBoardStores = new ArrayList<>();
}
