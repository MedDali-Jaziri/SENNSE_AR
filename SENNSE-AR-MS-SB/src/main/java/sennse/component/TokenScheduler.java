package sennse.component;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import sennse.services.SennseAuthService;

@Component("tokenScheduler")
public class TokenScheduler {
    @Autowired
    private SennseAuthService authService;

    // Run once when the application starts
    @PostConstruct
    public void onStartup() {
        System.out.println("Running login on startup...");
        authService.loginToSENNSE();
    }

    // Run every hour (3600000 ms = 1 hour)
    @Scheduled(fixedRate = 3600000)
    public void refreshTokenEveryHour(){
        System.out.println("Scheduled login triggered...");
        authService.loginToSENNSE();
    }
}