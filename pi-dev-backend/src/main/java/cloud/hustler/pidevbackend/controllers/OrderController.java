package cloud.hustler.pidevbackend.controllers;
import cloud.hustler.pidevbackend.entity.Order;
import cloud.hustler.pidevbackend.repository.OrderRepository;
import cloud.hustler.pidevbackend.service.IOrderService;
import cloud.hustler.pidevbackend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    @Autowired
    IOrderService orderService;


    @PostMapping("/{customerUuid}/checkout")
    public Order checkout(@PathVariable UUID customerUuid) {
        return orderService.checkout(customerUuid);
    }

    @GetMapping("/{customerUuid}")
    public List<Order> getOrdersByCustomer(@PathVariable UUID customerUuid) {
        return orderService.getOrdersByCustomer(customerUuid);
    }

    @GetMapping("/order/{orderUuid}")
    public Order getOrderById(@PathVariable UUID orderUuid) {
        return orderService.getOrderById(orderUuid);
    }

    @PutMapping("/confirm/{orderUuid}")
    public void confirm(@PathVariable UUID orderUuid) {
        orderService.confirmOrder(orderUuid);
    }
    @PutMapping("/cancel/{orderUuid}")
    public void cancel(@PathVariable UUID orderUuid) {
        orderService.rejectOrder(orderUuid);
    }
}