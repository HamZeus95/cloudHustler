package cloud.hustler.pidevbackend.service;


import cloud.hustler.pidevbackend.entity.Crop;

import java.util.List;

public interface ICrop {
    Crop addCrop(Crop crop);
    Crop updateCrop(Crop crop);
    void deleteCrop(long idCrop);
    List<Crop> getAll();
    Crop getCrop(long idCrop);
}
