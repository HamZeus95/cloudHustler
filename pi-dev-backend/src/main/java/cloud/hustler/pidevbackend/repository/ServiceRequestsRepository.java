package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.ServiceRequests;
import cloud.hustler.pidevbackend.entity.Servicee;
import cloud.hustler.pidevbackend.entity.TypeJobStatus;
import cloud.hustler.pidevbackend.entity.TypeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ServiceRequestsRepository extends JpaRepository<ServiceRequests, UUID> {
    int countByStatus(TypeJobStatus status);

    List<ServiceRequests> findByStatus(TypeJobStatus status);

    List<ServiceRequests> findByServicee(Servicee servicee);
    
    // Add fetch join to efficiently load the users_applying collection
    @Query("SELECT sr FROM ServiceRequests sr LEFT JOIN FETCH sr.users_applying WHERE sr.uuid_serviceRequest = :id")
    Optional<ServiceRequests> findByIdWithUsers(@Param("id") UUID id);

    // List<ServiceRequests> findByServiceUuidService(UUID serviceUuid);
    //List<ServiceRequests> findByUsersApplyingUuid(UUID userUuid);
}
