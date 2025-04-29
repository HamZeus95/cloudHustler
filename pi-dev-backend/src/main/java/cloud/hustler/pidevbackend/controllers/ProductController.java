package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Product;
import cloud.hustler.pidevbackend.entity.ProductSalesDTO;
import cloud.hustler.pidevbackend.service.FileStorageService;
import cloud.hustler.pidevbackend.service.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    IProductService productService;
    private final FileStorageService fileStorageService;

    public ProductController(FileStorageService fileStorageService) {

        this.fileStorageService = fileStorageService;
    }

    @PostMapping(value = "/addProduct/{idProductCategory}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> addProduct(
            @RequestPart("product") Product product,
            @PathVariable UUID idProductCategory,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        try {
            if (imageFile != null && !imageFile.isEmpty()) {
                String filename = fileStorageService.store(imageFile);
                // Set the URL to match your resource handler
                product.setImageUrl("/product/images/" + filename);
            }

            Product savedProduct = productService.addProduct(product, idProductCategory);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(value = "/updateProduct/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> updateProduct(
            @PathVariable UUID id,
            @RequestPart("product") Product product,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        try {
            // Get the existing product first
            Product existingProduct = productService.retrieveProduct(id);

            if (imageFile != null && !imageFile.isEmpty()) {
                // Delete old image if it exists
                if (existingProduct.getImageUrl() != null && !existingProduct.getImageUrl().isEmpty()) {
                    try {
                        // Extract just the filename from the URL
                        String oldFilename = existingProduct.getImageUrl()
                                .replace("/product/images/", "")
                                .replace("/api/v1/product/images/", "");
                        fileStorageService.deleteFile(oldFilename);
                    } catch (IOException e) {
                        // Log the error but continue with the update
                        System.err.println("Failed to delete old image: " + e.getMessage());
                    }
                }

                // Store new image
                String filename = fileStorageService.store(imageFile);
                product.setImageUrl("/product/images/" + filename);
            } else {
                // Keep the existing image if no new image is provided
                product.setImageUrl(existingProduct.getImageUrl());
            }

            Product updatedProduct = productService.updateProduct(id, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
