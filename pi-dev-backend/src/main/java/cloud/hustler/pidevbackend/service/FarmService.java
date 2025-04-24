package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Crop;
import cloud.hustler.pidevbackend.entity.Farm;
import cloud.hustler.pidevbackend.repository.CropRepository;
import cloud.hustler.pidevbackend.repository.FarmRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@AllArgsConstructor
public class FarmService implements IFarm{
    @Autowired
    private FarmRepository farmRepository;
    @Autowired
    private CropRepository cropRepository;

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

    @Override
    public List<Crop> getCropsByFarm(UUID idFarm) {
        Farm farm = getFarm(idFarm);

        /*List<Crop> crops = new ArrayList<>();
        List<Crop> c =cropRepository.findAll();
        for (Crop crop : c) {
            if (crop.getFarm().getUuid_farm().equals(idFarm)) {
                crops.add(crop);
            }
        }
*/

return cropRepository.findAllByFarm(farm);


    }


}
