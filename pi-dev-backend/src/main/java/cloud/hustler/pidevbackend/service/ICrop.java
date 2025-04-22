package cloud.hustler.pidevbackend.service;


import cloud.hustler.pidevbackend.entity.Crop;

import java.util.List;
import java.util.UUID;

public interface ICrop {
    Crop addCrop(Crop crop,UUID idFarm);
    Crop updateCrop(Crop crop);
    void deleteCrop(UUID idCrop);
    List<Crop> getAll();
    Crop getCrop(UUID idCrop);
}
