package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Farm;

import java.util.List;

public interface IFarm {

    Farm addFarm(Farm farm);
    Farm updateFarm(Farm farm);
    void deleteFarm(long idFarm);
    List<Farm> getAll();
    Farm getFarm(long idFarm);
}
