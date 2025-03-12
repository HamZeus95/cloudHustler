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
        return null;
    }

    @Override
    public Farm updateFarm(Farm farm) {
        return null;
    }

    @Override
    public void deleteFarm(long idFarm) {

    }

    @Override
    public List<Farm> getAll() {
        return List.of();
    }

    @Override
    public Farm getFarm(long idFarm) {
        return null;
    }
}
