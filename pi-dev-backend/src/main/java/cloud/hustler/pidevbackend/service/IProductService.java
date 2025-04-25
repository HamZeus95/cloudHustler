package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Product;
import cloud.hustler.pidevbackend.entity.ProductSalesDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface IProductService {
    Product addProduct(Product product, UUID idProductCategory);
    Product updateProduct(Product product);
    void deleteProduct(UUID idProduct);
    List<Product> retrieveAllProducts();
    Product retrieveProduct(UUID idProduct);
    Product applyDiscount(UUID idProduct, int discount);
    Product removeDiscount(UUID idProduct);
    List<Product> getProductsByCategory(UUID categoryId);

    List<Product> getAllByOrderByCreatedAtDesc();
    List<Product> getAllByOrderByNameAsc();
    List<Product> getAllByOrderByNameDesc();
    List<Product> getAllByOrderByPriceAsc();
    List<Product> getAllByOrderByPriceDesc();

    // Price range filters
    List<Product> getByPriceBetween(Double minPrice, Double maxPrice);
    List<ProductSalesDTO> getTopSellingProducts();
}
