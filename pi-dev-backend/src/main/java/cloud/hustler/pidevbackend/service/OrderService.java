package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.*;
import cloud.hustler.pidevbackend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service

public class OrderService implements IOrderService {

    @Autowired
    private final OrderRepository orderRepository;
    @Autowired
    private final OrderItemRepository orderItemRepository;
    @Autowired
    private final CartRepository cartRepository;
    @Autowired
    private final CartItemRepository cartItemRepository;
    @Autowired
    private final ConsumerRepository consumerRepository;

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository, CartRepository cartRepository, CartItemRepository cartItemRepository, ConsumerRepository consumerRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.consumerRepository = consumerRepository;
    }

    @Transactional
    public Order checkout(UUID customerUuid) {
        Cart cart = cartRepository.findByConsumerUuid(customerUuid)
                .orElseThrow(() -> new IllegalStateException("Cart not found"));

        if (cart.getCartItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        Order order = new Order();
        Consumer customer = consumerRepository.findById(customerUuid).orElseThrow();
        order.setConsumer(customer);
        order.setStatus(OrderStatus.PENDING);
        double totalPrice = 0.0;
        order = orderRepository.save(order);

        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            totalPrice += orderItem.getProduct().getPrice() * cartItem.getQuantity();
            orderItemRepository.save(orderItem);
        }
        order.setTotalPrice(totalPrice);
        order = orderRepository.save(order);
        cartItemRepository.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        cart.setTotalPrice(0);
        cartRepository.save(cart);

        return order;
    }

    public List<Order> getOrdersByCustomer( UUID customerUuid) {
        return orderRepository.findByConsumerUuid(customerUuid);
    }

    public Order getOrderById( UUID orderUuid) {
        return orderRepository.findById(orderUuid).orElseThrow();
    }

    @Override
    public void confirmOrder(UUID orderUuid) {
        Order order = orderRepository.findById(orderUuid).orElseThrow();
        order.setStatus(OrderStatus.SUCCEEDED);
        orderRepository.save(order);
    }

    @Override
    public void rejectOrder(UUID orderUuid) {
        Order order = orderRepository.findById(orderUuid).orElseThrow();
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }
}
