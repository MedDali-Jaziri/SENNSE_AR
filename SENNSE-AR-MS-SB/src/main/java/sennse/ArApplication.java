package sennse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ArApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArApplication.class, args);
	}
}
