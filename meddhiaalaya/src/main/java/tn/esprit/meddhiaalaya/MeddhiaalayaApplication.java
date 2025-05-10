package tn.esprit.meddhiaalaya;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAspectJAutoProxy
//@Scheduled(fixedDelay = 60000) après l’exécution de la dernière invocation
//@Scheduled(fixedRate = 60000) même si la dernière exécution est en cours.
//@Scheduled(cron = "*/60 * * * * *" ) second minut heure jour mois jour de semain
public class MeddhiaalayaApplication {

    public static void main(String[] args) {
        SpringApplication.run(MeddhiaalayaApplication.class, args);
    }

}
