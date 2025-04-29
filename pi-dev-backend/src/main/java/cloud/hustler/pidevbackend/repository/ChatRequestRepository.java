package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.ChatRequest;
import cloud.hustler.pidevbackend.entity.ChatRequestStatus;
import cloud.hustler.pidevbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRequestRepository extends JpaRepository<ChatRequest, UUID> {
    
    // Find requests sent by a specific user
    List<ChatRequest> findBySender(User sender);
    
    // Find requests received by a specific user
    List<ChatRequest> findByReceiver(User receiver);
    
    // Find pending requests received by a user
    List<ChatRequest> findByReceiverAndStatus(User receiver, ChatRequestStatus status);
    
    // Find pending requests sent by a user
    List<ChatRequest> findBySenderAndStatus(User sender, ChatRequestStatus status);
    
    // Find a specific request between two users
    Optional<ChatRequest> findBySenderAndReceiver(User sender, User receiver);
    
    // Find the latest request between two users
    Optional<ChatRequest> findFirstBySenderAndReceiverOrderByCreatedAtDesc(User sender, User receiver);
    
    // Check if a request exists with any status
    boolean existsBySenderAndReceiver(User sender, User receiver);
    
    // Check if an approved chat request exists between users (in either direction)
    boolean existsBySenderAndReceiverAndStatus(User sender, User receiver, ChatRequestStatus status);
    default boolean existsApprovedChatBetweenUsers(User user1, User user2) {
        return existsBySenderAndReceiverAndStatus(user1, user2, ChatRequestStatus.APPROVED) || 
               existsBySenderAndReceiverAndStatus(user2, user1, ChatRequestStatus.APPROVED);
    }
}