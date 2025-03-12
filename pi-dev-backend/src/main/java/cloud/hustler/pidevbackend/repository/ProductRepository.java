package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
}
