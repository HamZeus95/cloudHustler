package tn.esprit.meddhiaalaya.config;


import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Component
@Aspect
@Slf4j
public class LoggingAspect {
//    @After("execution(* tn.esprit.meddhiaalaya.service.*.*(..))")
//    public void logMethodEntry(JoinPoint joinPoint) {
//        String name = joinPoint.getSignature().getName();
//        log.info("In method " + name + " : ");
//
//    }


    @AfterReturning("execution(* tn.esprit.meddhiaalaya.service.OrdreService.addOrdreAndAffectToActionAndPortefeuille())")
    public void affiche() {
        log.info("L'ordre est en train d'etre traite! " );


    }
}
