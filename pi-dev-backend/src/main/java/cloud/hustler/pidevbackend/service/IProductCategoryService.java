package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.ProductCategory;

import java.util.List;
import java.util.UUID;

public interface IProductCategoryService {
    ProductCategory addProductCategory(ProductCategory productCategory);
    ProductCategory updateProductCategory(ProductCategory productCategory);
    void deleteProductCategory(UUID idProductCategory);
    List<ProductCategory> retrieveAllProductCategories();
    ProductCategory retrieveProductCategory(UUID idProduct);
}
