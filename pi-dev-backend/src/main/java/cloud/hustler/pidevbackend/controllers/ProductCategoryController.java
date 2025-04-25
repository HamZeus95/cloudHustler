package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.ProductCategory;
import cloud.hustler.pidevbackend.service.IProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/productcategory")
public class ProductCategoryController {

    @Autowired
    IProductCategoryService productCategoryService;


    @PostMapping("/addProductCategory")
    ProductCategory addProductCategory(@RequestBody ProductCategory productCategory) {
        return productCategoryService.addProductCategory(productCategory);
    }

    @PutMapping("/updateProductCategory")
    ProductCategory updateProductCategory(@RequestBody ProductCategory productCategory) {
        return productCategoryService.updateProductCategory(productCategory);
    }

    @DeleteMapping("/deleteProduct/{idProductCategory}")
    void deleteProductCategory(@PathVariable UUID idProductCategory) {
        productCategoryService.deleteProductCategory(idProductCategory);
    }

    @GetMapping("/retrieveAllProductCategories")
    List<ProductCategory> retrieveAllProductCategories() {
        return productCategoryService.retrieveAllProductCategories();
    }

    @GetMapping("/retrieveProductCategory/{idProductCategory}")
    ProductCategory retrieveProductCategory(@PathVariable UUID idProductCategory) {
        return productCategoryService.retrieveProductCategory(idProductCategory);
    }
}
