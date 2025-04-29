package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.DTO.ProductRequest;
import cloud.hustler.pidevbackend.DTO.StripeResponse;
import cloud.hustler.pidevbackend.entity.*;
import cloud.hustler.pidevbackend.repository.*;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
    @Autowired
    private StripeService stripeService;

    public OrderService(StripeService stripeService,OrderRepository orderRepository, OrderItemRepository orderItemRepository, CartRepository cartRepository, CartItemRepository cartItemRepository, ConsumerRepository consumerRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.consumerRepository = consumerRepository;
        this.stripeService = stripeService;
    }

    @Transactional
    public StripeResponse prepareCheckout(UUID customerUuid) {
        Cart cart = cartRepository.findByConsumerUuid(customerUuid)
                .orElseThrow(() -> new IllegalStateException("Cart not found"));

        if (cart.getCartItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        // Calculate total price in cents
        long totalAmount = 0L;
        for (CartItem cartItem : cart.getCartItems()) {
            totalAmount += (long)(cartItem.getProduct().getPrice() * 100) * cartItem.getQuantity();
        }

        ProductRequest productRequest = new ProductRequest();
        productRequest.setAmount(totalAmount);
        productRequest.setQuantity(1L);
        productRequest.setName("Order for Customer " + customerUuid.toString());
        productRequest.setCurrency("usd");

        String successUrl = "http://localhost:4200/frontoffice/payment?session_id={CHECKOUT_SESSION_ID}";
        String cancelUrl = "http://localhost:4200/payment-cancel";

        return stripeService.createCheckoutSession(productRequest, successUrl, cancelUrl);
    }

    @Transactional
    public Order confirmOrderAfterPayment(String sessionId, UUID customerUuid) throws StripeException {
        Session session = stripeService.retrieveSession(sessionId);
        if (!"complete".equals(session.getStatus())) {
            throw new IllegalStateException("Payment not completed");
        }

        // Now payment is confirmed, create Order
        return createOrderFromCart(customerUuid);
    }

    public Order createOrderFromCart(UUID customerUuid) {
        Cart cart = cartRepository.findByConsumerUuid(customerUuid)
                .orElseThrow(() -> new IllegalStateException("Cart not found"));

        if (cart.getCartItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        Consumer customer = consumerRepository.findById(customerUuid).orElseThrow();
        Order order = new Order();
        order.setConsumer(customer);
        order.setStatus(OrderStatus.SUCCEEDED);
        order.setTotalPrice(0);
        order = orderRepository.save(order);

        Set<OrderItem> orderItems = new HashSet<>();
        double totalPrice = 0.0;

        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            totalPrice += cartItem.getProduct().getPrice() * cartItem.getQuantity();
            orderItems.add(orderItem);
        }

        orderItemRepository.saveAll(orderItems);
        order.setOrderItems(orderItems);
        order.setTotalPrice(totalPrice);
        order = orderRepository.save(order);

        cartItemRepository.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        cart.setTotalPrice(0);
        cartRepository.save(cart);

        return order;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
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
