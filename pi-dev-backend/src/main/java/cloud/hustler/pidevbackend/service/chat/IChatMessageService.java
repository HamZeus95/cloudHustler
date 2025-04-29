package cloud.hustler.pidevbackend.service.chat;

import cloud.hustler.pidevbackend.entity.ChatMessage;
import cloud.hustler.pidevbackend.entity.MessageType;
import cloud.hustler.pidevbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface IChatMessageService {
    
    /**
     * Send a direct message from one user to another
     * 
     * @param sender User sending the message
     * @param receiverId ID of the user receiving the message
     * @param content Plain text content of the message
     * @param messageType Type of message (TEXT, IMAGE, etc.)
     * @return The created chat message
     */
    ChatMessage sendDirectMessage(User sender, UUID receiverId, String content, MessageType messageType);
    
    /**
     * Send a message to a group
     * 
     * @param sender User sending the message
     * @param groupId ID of the group
     * @param content Plain text content of the message
     * @param messageType Type of message (TEXT, IMAGE, etc.)
     * @return The created chat message
     */
    ChatMessage sendGroupMessage(User sender, UUID groupId, String content, MessageType messageType);
    
    /**
     * Get direct messages between two users with pagination
     * 
     * @param user1 First user
     * @param user2 Second user
     * @param pageable Pagination information
     * @return Page of chat messages
     */
    Page<ChatMessage> getDirectMessagesBetweenUsers(User user1, User user2, Pageable pageable);
    
    /**
     * Get messages from a group chat with pagination
     * 
     * @param groupId Group ID
     * @param pageable Pagination information
     * @return Page of chat messages
     */
    Page<ChatMessage> getGroupMessages(UUID groupId, Pageable pageable);
    
    /**
     * Mark a message as read
     * 
     * @param messageId Message ID
     * @param user User marking the message as read
     * @return The updated message
     */
    ChatMessage markMessageAsRead(UUID messageId, User user);
    
    /**
     * Mark all direct messages from a specific sender as read
     * 
     * @param sender The sender of the messages
     * @param receiver The receiver/current user
     * @return Number of messages marked as read
     */
    int markAllMessagesFromSenderAsRead(User sender, User receiver);
    
    /**
     * Get unread message count for a user
     * 
     * @param user The user
     * @return Count of unread messages
     */
    long getUnreadMessageCount(User user);
    
    /**
     * Get unread message count from a specific sender
     * 
     * @param sender The sender
     * @param receiver The receiver/current user
     * @return Count of unread messages from the sender
     */
    long getUnreadMessageCountFromSender(User sender, User receiver);
    
    /**
     * Get unread messages in a group for a user
     * 
     * @param groupId Group ID
     * @param user The user
     * @return List of unread messages
     */
    List<ChatMessage> getUnreadGroupMessages(UUID groupId, User user);
    
    /**
     * Get unread message count in a group for a user
     * 
     * @param groupId Group ID
     * @param user The user
     * @return Count of unread messages in the group
     */
    long getUnreadGroupMessageCount(UUID groupId, User user);
    
    /**
     * Get a specific message by ID
     * 
     * @param messageId Message ID
     * @return The message
     */
    ChatMessage getMessageById(UUID messageId);
    
    /**
     * Delete a message (for sender only)
     * 
     * @param messageId Message ID
     * @param user User attempting to delete the message (must be sender)
     * @return True if deleted, false otherwise
     */
    boolean deleteMessage(UUID messageId, User user);
}