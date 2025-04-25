package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Crop;
import cloud.hustler.pidevbackend.entity.Farm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CropRepository extends JpaRepository<Crop, UUID> {

    //List<Crop> findAllByFarm_Uuid_farm(UUID farmUuid);
    List<Crop> findAllByFarm(Farm farm);


}
