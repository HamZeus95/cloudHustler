package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Product;

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
}
