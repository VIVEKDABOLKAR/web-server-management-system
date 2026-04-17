package com.wsms.config;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.wsms.repository.OSTypeRepo;
import com.wsms.repository.WebServerTypeRepo;
import com.wsms.entity.OSType;
import com.wsms.entity.WebServerType;
import com.wsms.service.AppConfigService;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            OSTypeRepo osRepo,
            WebServerTypeRepo webRepo,
            AppConfigService appConfigService
    ) {
        return args -> {

            //os-type seeder
            if (osRepo.count() == 0) {

                OSType linux = new OSType();
                linux.setName("Linux");
                linux.setActive(true);

                OSType windows = new OSType();
                windows.setName("Windows");
                windows.setActive(true);

                osRepo.save(linux);
                osRepo.save(windows);
            }

            //web-type seeder
            if (webRepo.count() == 0) {

                WebServerType apache = new WebServerType();
                apache.setName("Apache");
                apache.setActive(true);

                WebServerType nginx = new WebServerType();
                nginx.setName("Nginx");
                nginx.setActive(true);

                WebServerType iis = new WebServerType();
                iis.setName("IIS");
                iis.setActive(true);

                WebServerType tomcat = new WebServerType();
                tomcat.setName("Tomcat");
                tomcat.setActive(true);

                webRepo.save(apache);
                webRepo.save(nginx);
                webRepo.save(iis);
                webRepo.save(tomcat);
            }

            // app config seeder (creates singleton row via service if missing)
            appConfigService.getConfig();
        };
    }
}