package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Consumer;
import cloud.hustler.pidevbackend.repository.ConsumerRepository;
import cloud.hustler.pidevbackend.service.IConsumerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consumers")
@RequiredArgsConstructor
public class ConsumerController {


    @Autowired
    IConsumerService consumerService;

    @PostMapping
    public Consumer create(@RequestBody Consumer consumer) {
        return consumerService.createConsumer(consumer);
    }

    @GetMapping
    public List<Consumer> all() {
        return consumerService.getAllConsumers();
    }
}
