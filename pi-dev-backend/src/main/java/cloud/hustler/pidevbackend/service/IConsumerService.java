package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Consumer;

import java.util.List;

public interface IConsumerService {
    Consumer createConsumer(Consumer consumer);
    List<Consumer> getAllConsumers();
}
