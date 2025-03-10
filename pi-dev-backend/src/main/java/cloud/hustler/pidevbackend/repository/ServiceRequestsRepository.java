package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.ServiceRequests;
import cloud.hustler.pidevbackend.entity.TypeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ServiceRequestsRepository extends JpaRepository<ServiceRequests, UUID> {

    List<ServiceRequests> findByStatus(TypeStatus status);

   // List<ServiceRequests> findByServiceUuidService(UUID serviceUuid);
    //List<ServiceRequests> findByUsersApplyingUuid(UUID userUuid);
}
