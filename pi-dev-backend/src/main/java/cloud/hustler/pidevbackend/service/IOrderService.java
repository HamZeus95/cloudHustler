package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Order;
import cloud.hustler.pidevbackend.entity.ProductSalesDTO;

import java.util.List;
import java.util.UUID;

public interface IOrderService {
    Order checkout(UUID customerUuid);
    List<Order> getOrdersByCustomer(UUID customerUuid);
    Order getOrderById( UUID orderUuid);
    void confirmOrder(UUID orderUuid);
    void rejectOrder(UUID orderUuid);

}
