package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Crop;
import cloud.hustler.pidevbackend.entity.Farm;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IFarm {

    Farm addFarm(Farm farm);
    Farm updateFarm(Farm farm);
    void deleteFarm(UUID idFarm);
    List<Farm> getAll();
    Farm getFarm(UUID idFarm);
    List<Crop> getCropsByFarm(UUID idFarm);
}
