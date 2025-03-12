package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Product;
import cloud.hustler.pidevbackend.entity.ProductCategory;
import cloud.hustler.pidevbackend.repository.ProductCategoryRepository;
import cloud.hustler.pidevbackend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImplement implements IProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    public ProductServiceImplement(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Product addProduct(Product product, UUID idProductCategory) {
        ProductCategory productCategory = productCategoryRepository.findById(idProductCategory).get();
        product.setProductCategory(productCategory);
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(UUID idProduct) {
        productRepository.deleteById(idProduct);
    }

    @Override
    public List<Product> retrieveAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product retrieveProduct(UUID idProduct) {
        return productRepository.findById(idProduct).get();
    }
}
