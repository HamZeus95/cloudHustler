package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Farm;
import cloud.hustler.pidevbackend.repository.FarmRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class FarmService implements IFarm{
    @Autowired
    private FarmRepository farmRepository;

    @Override
    public Farm addFarm(Farm farm) {
        return farmRepository.save(farm);
    }

    @Override
    public Farm updateFarm(Farm farm) {
        return farmRepository.save(farm);
    }

    @Override
    public void deleteFarm(UUID idFarm) {
        farmRepository.deleteById(idFarm);

    }

    @Override
    public List<Farm> getAll() {
        return farmRepository.findAll();
    }

    @Override
    public Farm getFarm(UUID idFarm) {
        return farmRepository.findById(idFarm).get();
    }


}
