package sennse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sennse.model.BoardModel;
import sennse.services.BoardsService;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/sennse-ar")
public class BoardController {

    @Autowired
    BoardsService boardsService;

    @GetMapping("list-board")
    public List<BoardModel> loginToSENNSE(){
        return this.boardsService.listStoredBoard();
    }
}

