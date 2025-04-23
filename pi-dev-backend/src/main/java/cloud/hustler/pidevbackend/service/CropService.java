package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Crop;
import cloud.hustler.pidevbackend.entity.Farm;
import cloud.hustler.pidevbackend.repository.CropRepository;
import cloud.hustler.pidevbackend.repository.FarmRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
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


    //advanced methodes

    public String detectDisease(MultipartFile image, UUID cropId) {
        // Simulate API call or model inference
        return "Detected: Powdery Mildew (Confidence: 0.92)";
    }

    public double predictHarvest(UUID cropId, String weatherData) {
        // Simulate prediction
        return 1000.0; // kg
    }

    public Map<String, Double> optimizeResources(UUID cropId) {
        // Simulate optimization
        return Map.of("water", 500.0, "fertilizer", 50.0); // liters, kg
    }

    public String generateSeasonalStrategy(UUID farmId) {
        // Combine tasks, predictions, and optimizations
        return "{\"strategy\": \"Plant wheat in March, irrigate weekly, fertilize monthly\"}";
    }




}
