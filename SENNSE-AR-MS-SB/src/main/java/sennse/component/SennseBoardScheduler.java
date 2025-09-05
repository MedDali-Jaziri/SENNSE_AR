package sennse.component;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import sennse.services.BoardsService;

@Component
@DependsOn("tokenScheduler")
public class SennseBoardScheduler {

    @Autowired
    private BoardsService boardsService;

    // Run once when the application starts
    @PostConstruct
    public void onStartup() {
        System.out.println("Running Board List on startup...");
        boardsService.listOfBoard();
    }

    // Run every hour (3600000 ms = 1 hour)
    @Scheduled(fixedRate = 3600000)
    public void refreshDeviceEveryHour(){
        System.out.println("Scheduled Board List triggered...");
        boardsService.listOfBoard();
    }
}