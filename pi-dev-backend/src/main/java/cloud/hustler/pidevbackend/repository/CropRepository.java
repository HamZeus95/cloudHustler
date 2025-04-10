package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CropRepository extends JpaRepository<Crop, UUID> {
    List<Crop> findByFarmUuid(UUID farmUuid);


}
