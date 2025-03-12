package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Farm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FarmRepository extends JpaRepository<Farm, Long> {
}
