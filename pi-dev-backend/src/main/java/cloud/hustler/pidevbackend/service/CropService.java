package cloud.hustler.pidevbackend.service;


import cloud.hustler.pidevbackend.entity.Crop;
import cloud.hustler.pidevbackend.repository.CropRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CropService implements ICrop{
    @Autowired
    private CropRepository cropRepository;

    @Override
    public Crop addCrop(Crop crop) {
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
        return cropRepository.findById(idCrop).get();
    }
}
