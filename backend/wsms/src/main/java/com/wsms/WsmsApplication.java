package com.wsms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WsmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(WsmsApplication.class, args);
	}

}
