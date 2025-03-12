package cloud.hustler.pidevbackend.service;


import cloud.hustler.pidevbackend.entity.Crop;
import cloud.hustler.pidevbackend.repository.CropRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CropService implements ICrop{
    @Autowired
    private CropRepository cropRepository;

    @Override
    public Crop addCrop(Crop crop) {
        return null;
    }

    @Override
    public Crop updateCrop(Crop crop) {
        return null;
    }

    @Override
    public void deleteCrop(long idCrop) {

    }

    @Override
    public List<Crop> getAll() {
        return List.of();
    }

    @Override
    public Crop getCrop(long idCrop) {
        return null;
    }
}
