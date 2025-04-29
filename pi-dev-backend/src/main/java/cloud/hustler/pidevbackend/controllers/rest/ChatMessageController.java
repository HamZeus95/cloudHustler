package cloud.hustler.pidevbackend.controllers.rest;

import cloud.hustler.pidevbackend.dto.ChatMessageDTO;
import cloud.hustler.pidevbackend.entity.ChatMessage;
import cloud.hustler.pidevbackend.entity.MessageType;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.UserRepository;
import cloud.hustler.pidevbackend.service.chat.IChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chat/messages")
public class ChatMessageController {
    
    private final IChatMessageService chatMessageService;
    private final UserRepository userRepository;
    
    @Autowired
    public ChatMessageController(IChatMessageService chatMessageService, UserRepository userRepository) {
        this.chatMessageService = chatMessageService;
        this.userRepository = userRepository;
    }
    
    @PostMapping("/send/direct/{receiverId}")
    public ResponseEntity<ChatMessageDTO> sendDirectMessage(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID receiverId,
            @RequestBody Map<String, Object> payload) {
        
        String content = (String) payload.get("content");
        MessageType messageType = MessageType.valueOf((String) payload.getOrDefault("messageType", "TEXT"));
        
        ChatMessage message = chatMessageService.sendDirectMessage(currentUser, receiverId, content, messageType);
        return ResponseEntity.ok(ChatMessageDTO.fromEntity(message));
    }
    
    @PostMapping("/send/group/{groupId}")
    public ResponseEntity<ChatMessageDTO> sendGroupMessage(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID groupId,
            @RequestBody Map<String, Object> payload) {
        
        String content = (String) payload.get("content");
        MessageType messageType = MessageType.valueOf((String) payload.getOrDefault("messageType", "TEXT"));
        
        ChatMessage message = chatMessageService.sendGroupMessage(currentUser, groupId, content, messageType);
        return ResponseEntity.ok(ChatMessageDTO.fromEntity(message));
    }
    
    @GetMapping("/direct/{userId}")
    public ResponseEntity<Page<ChatMessageDTO>> getDirectMessages(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        // Find the user from repository instead of direct instantiation
        User otherUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User with ID " + userId + " not found"));
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<ChatMessage> messages = chatMessageService.getDirectMessagesBetweenUsers(currentUser, otherUser, pageable);
        
        // Mark messages as read
        if (!messages.isEmpty()) {
            chatMessageService.markAllMessagesFromSenderAsRead(otherUser, currentUser);
        }
        
        Page<ChatMessageDTO> messageDTOs = messages.map(ChatMessageDTO::fromEntity);
        return ResponseEntity.ok(messageDTOs);
    }
    
    @GetMapping("/group/{groupId}")
    public ResponseEntity<Page<ChatMessageDTO>> getGroupMessages(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<ChatMessage> messages = chatMessageService.getGroupMessages(groupId, pageable);
        
        Page<ChatMessageDTO> messageDTOs = messages.map(ChatMessageDTO::fromEntity);
        return ResponseEntity.ok(messageDTOs);
    }
    
    @PostMapping("/{messageId}/read")
    public ResponseEntity<ChatMessageDTO> markMessageAsRead(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID messageId) {
        
        ChatMessage message = chatMessageService.markMessageAsRead(messageId, currentUser);
        return ResponseEntity.ok(ChatMessageDTO.fromEntity(message));
    }
    
    @PostMapping("/read-all/from/{senderId}")
    public ResponseEntity<Integer> markAllMessagesFromSenderAsRead(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID senderId) {
        
        // Find the sender from repository instead of direct instantiation
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User with ID " + senderId + " not found"));
        
        int count = chatMessageService.markAllMessagesFromSenderAsRead(sender, currentUser);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadMessageCount(@AuthenticationPrincipal User currentUser) {
        long count = chatMessageService.getUnreadMessageCount(currentUser);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/unread/from/{senderId}/count")
    public ResponseEntity<Long> getUnreadMessageCountFromSender(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID senderId) {
        
        // Find the sender from repository instead of direct instantiation
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User with ID " + senderId + " not found"));
        
        long count = chatMessageService.getUnreadMessageCountFromSender(sender, currentUser);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/unread/group/{groupId}")
    public ResponseEntity<List<ChatMessageDTO>> getUnreadGroupMessages(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID groupId) {
        
        List<ChatMessage> messages = chatMessageService.getUnreadGroupMessages(groupId, currentUser);
        List<ChatMessageDTO> messageDTOs = messages.stream()
                .map(ChatMessageDTO::fromEntity)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(messageDTOs);
    }
    
    @GetMapping("/unread/group/{groupId}/count")
    public ResponseEntity<Long> getUnreadGroupMessageCount(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID groupId) {
        
        long count = chatMessageService.getUnreadGroupMessageCount(groupId, currentUser);
        return ResponseEntity.ok(count);
    }
    
    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID messageId) {
        
        boolean deleted = chatMessageService.deleteMessage(messageId, currentUser);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}