package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.ChatGroup;
import cloud.hustler.pidevbackend.entity.ChatMessage;
import cloud.hustler.pidevbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    
    // Find direct messages between two users, ordered by timestamp
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "((m.sender = :user1 AND m.receiver = :user2) OR " +
           "(m.sender = :user2 AND m.receiver = :user1)) AND " +
           "m.group IS NULL " +
           "ORDER BY m.timestamp DESC")
    Page<ChatMessage> findDirectMessagesBetweenUsers(
            @Param("user1") User user1,
            @Param("user2") User user2,
            Pageable pageable);
    
    // Find unread messages for a user
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "m.receiver = :user AND " +
           "m.isRead = false")
    List<ChatMessage> findUnreadMessagesForUser(@Param("user") User user);
    
    // Count unread messages for a user
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE " +
           "m.receiver = :user AND " +
           "m.isRead = false")
    long countUnreadMessagesForUser(@Param("user") User user);
    
    // Count unread direct messages from a specific sender
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE " +
           "m.receiver = :receiver AND " +
           "m.sender = :sender AND " +
           "m.isRead = false")
    long countUnreadMessagesFromSender(
            @Param("receiver") User receiver,
            @Param("sender") User sender);
    
    // Find all messages in a group chat
    List<ChatMessage> findByGroupOrderByTimestampDesc(ChatGroup group, Pageable pageable);
    
    // Find unread messages in a group for a specific user
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "m.group = :group AND " +
           "m.sender != :user AND " +
           "m.timestamp > :lastReadTime")
    List<ChatMessage> findUnreadGroupMessages(
            @Param("group") ChatGroup group,
            @Param("user") User user,
            @Param("lastReadTime") java.time.LocalDateTime lastReadTime);
    
    // Count unread messages in a group for a specific user
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE " +
           "m.group = :group AND " +
           "m.sender != :user AND " +
           "m.timestamp > :lastReadTime")
    long countUnreadGroupMessages(
            @Param("group") ChatGroup group,
            @Param("user") User user,
            @Param("lastReadTime") java.time.LocalDateTime lastReadTime);
}