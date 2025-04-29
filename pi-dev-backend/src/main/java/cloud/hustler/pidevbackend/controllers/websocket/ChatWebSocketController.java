package cloud.hustler.pidevbackend.controllers.websocket;

import cloud.hustler.pidevbackend.dto.ChatMessageDTO;
import cloud.hustler.pidevbackend.dto.ChatRequestDTO;
import cloud.hustler.pidevbackend.entity.ChatMessage;
import cloud.hustler.pidevbackend.entity.ChatRequest;
import cloud.hustler.pidevbackend.entity.MessageType;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.UserRepository;
import cloud.hustler.pidevbackend.service.chat.IChatMessageService;
import cloud.hustler.pidevbackend.service.chat.IChatRequestService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final IChatMessageService chatMessageService;
    private final IChatRequestService chatRequestService;
    private final UserRepository userRepository;

    @Autowired
    public ChatWebSocketController(
            SimpMessagingTemplate messagingTemplate,
            IChatMessageService chatMessageService,
            IChatRequestService chatRequestService,
            UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.chatMessageService = chatMessageService;
        this.chatRequestService = chatRequestService;
        this.userRepository = userRepository;
    }

    /**
     * Handle direct message sent via WebSocket
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageDTO messageDTO, SimpMessageHeaderAccessor headerAccessor) {
        // Get the authenticated user
        Authentication authentication = (Authentication) headerAccessor.getUser();
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            // Validate and save the message
            ChatMessage savedMessage = chatMessageService.sendDirectMessage(
                    currentUser,
                    messageDTO.getReceiverId(),
                    messageDTO.getContent(),
                    messageDTO.getMessageType() != null ? messageDTO.getMessageType() : MessageType.TEXT
            );
            
            // Convert to DTO for sending via WebSocket
            ChatMessageDTO responseDTO = ChatMessageDTO.fromEntity(savedMessage);
            
            // Send to the specific user
            messagingTemplate.convertAndSendToUser(
                    messageDTO.getReceiverId().toString(),
                    "/queue/messages",
                    responseDTO
            );
            
            // Also send back to the sender to confirm receipt
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/messages",
                    responseDTO
            );
        } catch (Exception e) {
            // Send error to sender
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/errors",
                    "Error sending message: " + e.getMessage()
            );
        }
    }

    /**
     * Handle group message sent via WebSocket
     */
    @MessageMapping("/chat.sendGroupMessage")
    public void sendGroupMessage(@Payload ChatMessageDTO messageDTO, SimpMessageHeaderAccessor headerAccessor) {
        // Get the authenticated user
        Authentication authentication = (Authentication) headerAccessor.getUser();
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            // Validate and save the group message
            ChatMessage savedMessage = chatMessageService.sendGroupMessage(
                    currentUser,
                    messageDTO.getGroupId(),
                    messageDTO.getContent(),
                    messageDTO.getMessageType() != null ? messageDTO.getMessageType() : MessageType.TEXT
            );
            
            // Convert to DTO for sending via WebSocket
            ChatMessageDTO responseDTO = ChatMessageDTO.fromEntity(savedMessage);
            
            // Broadcast to the group topic
            messagingTemplate.convertAndSend(
                    "/topic/group/" + messageDTO.getGroupId(),
                    responseDTO
            );
        } catch (Exception e) {
            // Send error to sender
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/errors",
                    "Error sending group message: " + e.getMessage()
            );
        }
    }

    /**
     * Handle chat request sent via WebSocket
     */
    @MessageMapping("/chat.sendRequest")
    public void sendChatRequest(@Payload UUID receiverId, SimpMessageHeaderAccessor headerAccessor) {
        // Get the authenticated user
        Authentication authentication = (Authentication) headerAccessor.getUser();
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            // Create and save the chat request
            ChatRequest chatRequest = chatRequestService.sendChatRequest(currentUser, receiverId);
            
            // Convert to DTO for sending via WebSocket
            ChatRequestDTO requestDTO = ChatRequestDTO.fromEntity(chatRequest);
            
            // Send notification to receiver
            messagingTemplate.convertAndSendToUser(
                    receiverId.toString(),
                    "/queue/requests",
                    requestDTO
            );
            
            // Send confirmation to sender
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/requests",
                    requestDTO
            );
        } catch (Exception e) {
            // Send error to sender
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/errors",
                    "Error sending chat request: " + e.getMessage()
            );
        }
    }

    /**
     * Handle chat request approval via WebSocket
     */
    @MessageMapping("/chat.approveRequest")
    public void approveChatRequest(@Payload UUID requestId, SimpMessageHeaderAccessor headerAccessor) {
        // Get the authenticated user
        Authentication authentication = (Authentication) headerAccessor.getUser();
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            // Approve the chat request
            ChatRequest approvedRequest = chatRequestService.approveChatRequest(requestId, currentUser);
            
            // Convert to DTO for sending via WebSocket
            ChatRequestDTO requestDTO = ChatRequestDTO.fromEntity(approvedRequest);
            
            // Send notification to the sender of the original request
            messagingTemplate.convertAndSendToUser(
                    approvedRequest.getSender().getUuid_user().toString(),
                    "/queue/requestUpdates",
                    requestDTO
            );
            
            // Send confirmation to the receiver/approver
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/requestUpdates",
                    requestDTO
            );
        } catch (Exception e) {
            // Send error to the user
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/errors",
                    "Error approving chat request: " + e.getMessage()
            );
        }
    }

    /**
     * Handle chat request rejection via WebSocket
     */
    @MessageMapping("/chat.rejectRequest")
    public void rejectChatRequest(@Payload UUID requestId, SimpMessageHeaderAccessor headerAccessor) {
        // Get the authenticated user
        Authentication authentication = (Authentication) headerAccessor.getUser();
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            // Reject the chat request
            ChatRequest rejectedRequest = chatRequestService.rejectChatRequest(requestId, currentUser);
            
            // Convert to DTO for sending via WebSocket
            ChatRequestDTO requestDTO = ChatRequestDTO.fromEntity(rejectedRequest);
            
            // Send notification to the sender of the original request
            messagingTemplate.convertAndSendToUser(
                    rejectedRequest.getSender().getUuid_user().toString(),
                    "/queue/requestUpdates",
                    requestDTO
            );
            
            // Send confirmation to the receiver/rejecter
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/requestUpdates",
                    requestDTO
            );
        } catch (Exception e) {
            // Send error to the user
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/errors",
                    "Error rejecting chat request: " + e.getMessage()
            );
        }
    }

    /**
     * Mark message as read via WebSocket
     */
    @MessageMapping("/chat.markAsRead")
    public void markMessageAsRead(@Payload UUID messageId, SimpMessageHeaderAccessor headerAccessor) {
        // Get the authenticated user
        Authentication authentication = (Authentication) headerAccessor.getUser();
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            // Mark the message as read
            ChatMessage readMessage = chatMessageService.markMessageAsRead(messageId, currentUser);
            
            // Convert to DTO
            ChatMessageDTO messageDTO = ChatMessageDTO.fromEntity(readMessage);
            
            // Notify the sender that their message has been read
            messagingTemplate.convertAndSendToUser(
                    readMessage.getSender().getUuid_user().toString(),
                    "/queue/readReceipts",
                    messageDTO
            );
        } catch (Exception e) {
            // Send error to the user
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/errors",
                    "Error marking message as read: " + e.getMessage()
            );
        }
    }
    
    /**
     * Get direct messages between users via WebSocket
     */
    @MessageMapping("/chat.getDirectMessages")
    public void getDirectMessages(@Payload Map<String, Object> payload, SimpMessageHeaderAccessor headerAccessor) {
        Authentication authentication = (Authentication) headerAccessor.getUser();
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            UUID userId = UUID.fromString((String) payload.get("userId"));
            int page = (int) payload.getOrDefault("page", 0);
            int size = (int) payload.getOrDefault("size", 20);
            
            // Find the other user
            User otherUser = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
            
            // Get paginated messages
            Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
            Page<ChatMessage> messages = chatMessageService.getDirectMessagesBetweenUsers(currentUser, otherUser, pageable);
            
            // Mark messages as read
            if (!messages.isEmpty()) {
                chatMessageService.markAllMessagesFromSenderAsRead(otherUser, currentUser);
            }
            
            // Convert to DTOs and send back to client
            Page<ChatMessageDTO> messageDTOs = messages.map(ChatMessageDTO::fromEntity);
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", messageDTOs.getContent());
            response.put("totalPages", messageDTOs.getTotalPages());
            response.put("totalElements", messageDTOs.getTotalElements());
            response.put("currentPage", messageDTOs.getNumber());
            
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/directMessages",
                    response
            );
        } catch (Exception e) {
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/errors",
                    "Error fetching direct messages: " + e.getMessage()
            );
        }
    }
    
    /**
     * Get group messages via WebSocket
     */
    @MessageMapping("/chat.getGroupMessages")
    public void getGroupMessages(@Payload Map<String, Object> payload, SimpMessageHeaderAccessor headerAccessor) {
        Authentication authentication = (Authentication) headerAccessor.getUser();
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            UUID groupId = UUID.fromString((String) payload.get("groupId"));
            int page = (int) payload.getOrDefault("page", 0);
            int size = (int) payload.getOrDefault("size", 20);
            
            // Get paginated group messages
            Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
            Page<ChatMessage> messages = chatMessageService.getGroupMessages(groupId, pageable);
            
            // Convert to DTOs and send back to client
            Page<ChatMessageDTO> messageDTOs = messages.map(ChatMessageDTO::fromEntity);
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", messageDTOs.getContent());
            response.put("totalPages", messageDTOs.getTotalPages());
            response.put("totalElements", messageDTOs.getTotalElements());
            response.put("currentPage", messageDTOs.getNumber());
            
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/groupMessages",
                    response
            );
        } catch (Exception e) {
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/errors",
                    "Error fetching group messages: " + e.getMessage()
            );
        }
    }
    
    /**
     * Mark all messages from a sender as read via WebSocket
     */
    @MessageMapping("/chat.markAllMessagesFromSenderAsRead")
    public void markAllMessagesFromSenderAsRead(@Payload UUID senderId, SimpMessageHeaderAccessor headerAccessor) {
        Authentication authentication = (Authentication) headerAccessor.getUser();
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            // Find the sender
            User sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + senderId));
            
            // Mark all messages from sender as read
            int count = chatMessageService.markAllMessagesFromSenderAsRead(sender, currentUser);
            
            // Send confirmation back to client
            Map<String, Object> response = new HashMap<>();
            response.put("senderId", senderId);
            response.put("markedCount", count);
            
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/messagesMarkedAsRead",
                    response
            );
            
            // Also notify sender that their messages have been read
            if (count > 0) {
                messagingTemplate.convertAndSendToUser(
                        senderId.toString(),
                        "/queue/bulkReadReceipts",
                        Map.of(
                            "receiverId", currentUser.getUuid_user(),
                            "markedCount", count
                        )
                );
            }
        } catch (Exception e) {
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/errors",
                    "Error marking messages as read: " + e.getMessage()
            );
        }
    }
    
    /**
     * Get unread message count via WebSocket
     */
    @MessageMapping("/chat.getUnreadMessageCount")
    public void getUnreadMessageCount(SimpMessageHeaderAccessor headerAccessor) {
        Authentication authentication = (Authentication) headerAccessor.getUser();
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            long count = chatMessageService.getUnreadMessageCount(currentUser);
            
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/unreadMessageCount",
                    Map.of("count", count)
            );
        } catch (Exception e) {
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/errors",
                    "Error getting unread message count: " + e.getMessage()
            );
        }
    }
    
    /**
     * Get unread message count from a specific sender via WebSocket
     */
    @MessageMapping("/chat.getUnreadMessageCountFromSender")
    public void getUnreadMessageCountFromSender(@Payload UUID senderId, SimpMessageHeaderAccessor headerAccessor) {
        Authentication authentication = (Authentication) headerAccessor.getUser();
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            // Find the sender
            User sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + senderId));
            
            // Get unread message count
            long count = chatMessageService.getUnreadMessageCountFromSender(sender, currentUser);
            
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/unreadMessageCountFromSender",
                    Map.of(
                        "senderId", senderId,
                        "count", count
                    )
            );
        } catch (Exception e) {
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/errors",
                    "Error getting unread message count: " + e.getMessage()
            );
        }
    }
    
    /**
     * Get unread group messages via WebSocket
     */
    @MessageMapping("/chat.getUnreadGroupMessages")
    public void getUnreadGroupMessages(@Payload UUID groupId, SimpMessageHeaderAccessor headerAccessor) {
        Authentication authentication = (Authentication) headerAccessor.getUser();
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            // Get unread group messages
            List<ChatMessage> unreadMessages = chatMessageService.getUnreadGroupMessages(groupId, currentUser);
            
            // Convert to DTOs
            List<ChatMessageDTO> messageDTOs = unreadMessages.stream()
                    .map(ChatMessageDTO::fromEntity)
                    .collect(Collectors.toList());
            
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/unreadGroupMessages",
                    Map.of(
                        "groupId", groupId,
                        "messages", messageDTOs
                    )
            );
        } catch (Exception e) {
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/errors",
                    "Error getting unread group messages: " + e.getMessage()
            );
        }
    }
    
    /**
     * Get unread group message count via WebSocket
     */
    @MessageMapping("/chat.getUnreadGroupMessageCount")
    public void getUnreadGroupMessageCount(@Payload UUID groupId, SimpMessageHeaderAccessor headerAccessor) {
        Authentication authentication = (Authentication) headerAccessor.getUser();
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            // Get unread group message count
            long count = chatMessageService.getUnreadGroupMessageCount(groupId, currentUser);
            
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/unreadGroupMessageCount",
                    Map.of(
                        "groupId", groupId,
                        "count", count
                    )
            );
        } catch (Exception e) {
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/errors",
                    "Error getting unread group message count: " + e.getMessage()
            );
        }
    }
    
    /**
     * Delete a message via WebSocket
     */
    @MessageMapping("/chat.deleteMessage")
    public void deleteMessage(@Payload UUID messageId, SimpMessageHeaderAccessor headerAccessor) {
        Authentication authentication = (Authentication) headerAccessor.getUser();
        User currentUser = (User) authentication.getPrincipal();
        
        try {
            // Try to get the message first to check if it's direct or group
            ChatMessage message = chatMessageService.getMessageById(messageId);
            
            // Store receiver/group details before deletion
            UUID receiverId = message.getReceiver() != null ? message.getReceiver().getUuid_user() : null;
            UUID groupId = message.getGroup() != null ? message.getGroup().getId() : null;
            
            // Delete the message
            boolean deleted = chatMessageService.deleteMessage(messageId, currentUser);
            
            if (deleted) {
                // Notify sender
                messagingTemplate.convertAndSendToUser(
                        currentUser.getUuid_user().toString(),
                        "/queue/messageDeleted",
                        Map.of("messageId", messageId, "deleted", true)
                );
                
                // Notify receiver if it's a direct message
                if (receiverId != null) {
                    messagingTemplate.convertAndSendToUser(
                            receiverId.toString(),
                            "/queue/messageDeleted",
                            Map.of("messageId", messageId, "deleted", true)
                    );
                }
                
                // Notify group members if it's a group message
                if (groupId != null) {
                    messagingTemplate.convertAndSend(
                            "/topic/group/" + groupId + "/messageDeleted",
                            Map.of("messageId", messageId, "deleted", true)
                    );
                }
            } else {
                throw new AccessDeniedException("Failed to delete message");
            }
        } catch (Exception e) {
            messagingTemplate.convertAndSendToUser(
                    currentUser.getUuid_user().toString(),
                    "/queue/errors",
                    "Error deleting message: " + e.getMessage()
            );
        }
    }
}