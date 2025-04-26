package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Consumer;
import cloud.hustler.pidevbackend.repository.ConsumerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ConsumerServiceImplement implements IConsumerService {

    @Autowired
    private ConsumerRepository consumerRepository;

    ConsumerServiceImplement(ConsumerRepository consumerRepository) {
        this.consumerRepository = consumerRepository;
    }
    @Override
    public Consumer createConsumer(Consumer consumer) {
        return consumerRepository.save(consumer);
    }

    @Override
    public List<Consumer> getAllConsumers() {
        return consumerRepository.findAll();
    }
}
