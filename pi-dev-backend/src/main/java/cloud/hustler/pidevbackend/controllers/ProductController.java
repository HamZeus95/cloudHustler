package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Product;
import cloud.hustler.pidevbackend.service.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:4200")
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


}
