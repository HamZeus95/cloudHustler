package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Product;
import cloud.hustler.pidevbackend.entity.ProductSalesDTO;
import cloud.hustler.pidevbackend.service.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    IProductService productService;

    @PostMapping("/addProduct/{idProductCategory}")
    Product addProduct(@RequestBody Product product, @PathVariable UUID idProductCategory) {

        return productService.addProduct(product, idProductCategory);
    }

    @PutMapping("/updateProduct")
    Product updateProduct(@RequestBody Product product) {
        return productService.updateProduct(product);
    }

    @DeleteMapping("/deleteProduct/{idProduct}")
    void deleteProduct(@PathVariable UUID idProduct) {
        productService.deleteProduct(idProduct);
    }

    @GetMapping("/retrieveAllProducts")
    List<Product> retrieveAllProducts() {
        return productService.retrieveAllProducts();
    }

    @GetMapping("/retrieveProduct/{idProduct}")
    Product retrieveProduct(@PathVariable UUID idProduct) {
        return productService.retrieveProduct(idProduct);
    }

    @PutMapping("/applyDiscount/{idProduct}")
    public Product applyDiscount(@PathVariable UUID idProduct, @RequestParam int discount) {
        return productService.applyDiscount(idProduct, discount);
    }

    @PutMapping("/removeDiscount/{idProduct}")
    public Product removeDiscount(@PathVariable UUID idProduct) {
        return productService.removeDiscount(idProduct);
    }

    @GetMapping("/by-category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable UUID categoryId) {

       return productService.getProductsByCategory(categoryId);
    }

    @GetMapping("/newest")
    public List<Product> getNewestProducts() {
        return productService.getAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/name-asc")
    public List<Product> getProductsByNameAsc() {
        return productService.getAllByOrderByNameAsc();
    }

    @GetMapping("/name-desc")
    public List<Product> getProductsByNameDesc() {
        return productService.getAllByOrderByNameDesc();
    }

    @GetMapping("/price-asc")
    public List<Product> getProductsByPriceAsc() {
        return productService.getAllByOrderByPriceAsc();
    }

    @GetMapping("/price-desc")
    public List<Product> getProductsByPriceDesc() {
        return productService.getAllByOrderByPriceDesc();
    }

    // Price range endpoints
    @GetMapping("/price-range")
    public List<Product> getProductsByPriceRange(
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        return productService.getByPriceBetween(minPrice, maxPrice);
    }

    @GetMapping("/top-sold-products")
    public List<ProductSalesDTO> getTopSellingProducts() {
        return productService.getTopSellingProducts();
    }


}
