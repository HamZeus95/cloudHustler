package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Servicee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ServiceRepository extends JpaRepository<Servicee, UUID> {
    List<Servicee> findByIsHiring(boolean isHiring);
    List<Servicee> findByCategory(String category);
  //  List<Servicee> findByFarmerUuid(UUID farmerUuid);
}