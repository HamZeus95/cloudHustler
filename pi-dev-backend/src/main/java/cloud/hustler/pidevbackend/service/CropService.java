package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Crop;
import cloud.hustler.pidevbackend.entity.Farm;
import cloud.hustler.pidevbackend.repository.CropRepository;
import cloud.hustler.pidevbackend.repository.FarmRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CropService implements ICrop {
    @Autowired
    private CropRepository cropRepository;
    private FarmRepository farmRepository;


//add crop to farm
    @Override
    public Crop addCrop(Crop crop, UUID idFarm) {
        Farm farm = farmRepository.findById(idFarm).get();
        farm.addCrop(crop);
        crop.setFarm(farm);
        return cropRepository.save(crop);
    }

    @Override
    public Crop updateCrop(Crop crop) {
        return cropRepository.save(crop);
    }

    @Override
    public void deleteCrop(UUID idCrop) {
        cropRepository.deleteById(idCrop);
    }

    @Override
    public List<Crop> getAll() {
        return cropRepository.findAll();
    }

    @Override
    public Crop getCrop(UUID idCrop) {
        return cropRepository.findById(idCrop).orElse(null);
    }


}
