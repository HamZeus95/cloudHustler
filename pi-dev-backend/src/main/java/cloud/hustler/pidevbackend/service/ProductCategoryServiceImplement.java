package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.ProductCategory;
import cloud.hustler.pidevbackend.repository.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductCategoryServiceImplement implements IProductCategoryService {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    ProductCategoryServiceImplement(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    @Override
    public ProductCategory addProductCategory(ProductCategory productCategory) {
        return productCategoryRepository.save(productCategory);
    }

    @Override
    public ProductCategory updateProductCategory(ProductCategory productCategory) {
        return productCategoryRepository.save(productCategory);
    }

    @Override
    public void deleteProductCategory(UUID idProductCategory) {
        productCategoryRepository.deleteById(idProductCategory);
    }

    @Override
    public List<ProductCategory> retrieveAllProductCategories() {
        return productCategoryRepository.findAll();
    }

    @Override
    public ProductCategory retrieveProductCategory(UUID idProduct) {
        return productCategoryRepository.findById(idProduct).get();
    }
}
