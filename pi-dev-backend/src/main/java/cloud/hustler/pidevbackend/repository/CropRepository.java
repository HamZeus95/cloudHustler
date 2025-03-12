package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {

}
