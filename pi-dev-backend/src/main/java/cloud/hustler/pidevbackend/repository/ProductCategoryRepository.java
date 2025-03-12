package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, UUID> {
}
