package cloud.hustler.pidevbackend.service.chat;

import cloud.hustler.pidevbackend.entity.ChatRequest;
import cloud.hustler.pidevbackend.entity.User;

import java.util.List;
import java.util.UUID;

public interface IChatRequestService {
    
    /**
     * Send a chat request from one user to another
     * 
     * @param sender The user sending the request
     * @param receiverId The ID of the user receiving the request
     * @return The created chat request
     */
    ChatRequest sendChatRequest(User sender, UUID receiverId);
    
    /**
     * Approve a pending chat request
     * 
     * @param requestId The ID of the chat request
     * @param user The user approving the request (must be the receiver)
     * @return The approved chat request
     */
    ChatRequest approveChatRequest(UUID requestId, User user);
    
    /**
     * Reject a pending chat request
     * 
     * @param requestId The ID of the chat request
     * @param user The user rejecting the request (must be the receiver)
     * @return The rejected chat request
     */
    ChatRequest rejectChatRequest(UUID requestId, User user);
    
    /**
     * Get all chat requests received by a user
     * 
     * @param user The user
     * @return List of chat requests received by the user
     */
    List<ChatRequest> getReceivedChatRequests(User user);
    
    /**
     * Get all pending chat requests received by a user
     * 
     * @param user The user
     * @return List of pending chat requests received by the user
     */
    List<ChatRequest> getPendingReceivedChatRequests(User user);
    
    /**
     * Get all chat requests sent by a user
     * 
     * @param user The user
     * @return List of chat requests sent by the user
     */
    List<ChatRequest> getSentChatRequests(User user);
    
    /**
     * Check if users can chat with each other (if there's an approved chat request)
     * 
     * @param user1 First user
     * @param user2 Second user
     * @return true if users can chat, false otherwise
     */
    boolean canUsersChat(User user1, User user2);
    
    /**
     * Get a specific chat request by ID
     * 
     * @param requestId The chat request ID
     * @return The chat request
     */
    ChatRequest getChatRequestById(UUID requestId);
}