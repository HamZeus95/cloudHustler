package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Farm;
import cloud.hustler.pidevbackend.repository.FarmRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public void deleteFarm(long idFarm) {
        farmRepository.deleteById(idFarm);

    }

    @Override
    public List<Farm> getAll() {
        return farmRepository.findAll();
    }

    @Override
    public Farm getFarm(long idFarm) {
        return farmRepository.findById(idFarm).get();
    }
}
