package cloud.hustler.pidevbackend.controllers.rest;

import cloud.hustler.pidevbackend.dto.ChatRequestDTO;
import cloud.hustler.pidevbackend.entity.ChatRequest;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.UserRepository;
import cloud.hustler.pidevbackend.service.chat.IChatRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chat/requests")
public class ChatRequestController {
    
    private final IChatRequestService chatRequestService;
    private final UserRepository userRepository;
    
    @Autowired
    public ChatRequestController(IChatRequestService chatRequestService, UserRepository userRepository) {
        this.chatRequestService = chatRequestService;
        this.userRepository = userRepository;
    }
    
    @PostMapping("/send/{receiverId}")
    public ResponseEntity<ChatRequestDTO> sendChatRequest(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID receiverId) {
        
        ChatRequest request = chatRequestService.sendChatRequest(currentUser, receiverId);
        return ResponseEntity.ok(ChatRequestDTO.fromEntity(request));
    }
    
    @PostMapping("/{requestId}/approve")
    public ResponseEntity<ChatRequestDTO> approveChatRequest(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID requestId) {
        
        ChatRequest request = chatRequestService.approveChatRequest(requestId, currentUser);
        return ResponseEntity.ok(ChatRequestDTO.fromEntity(request));
    }
    
    @PostMapping("/{requestId}/reject")
    public ResponseEntity<ChatRequestDTO> rejectChatRequest(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID requestId) {
        
        ChatRequest request = chatRequestService.rejectChatRequest(requestId, currentUser);
        return ResponseEntity.ok(ChatRequestDTO.fromEntity(request));
    }
    
    @GetMapping("/received")
    public ResponseEntity<List<ChatRequestDTO>> getReceivedRequests(@AuthenticationPrincipal User currentUser) {
        List<ChatRequest> requests = chatRequestService.getReceivedChatRequests(currentUser);
        List<ChatRequestDTO> requestDTOs = requests.stream()
                .map(ChatRequestDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(requestDTOs);
    }
    
    @GetMapping("/received/pending")
    public ResponseEntity<List<ChatRequestDTO>> getPendingReceivedRequests(@AuthenticationPrincipal User currentUser) {
        List<ChatRequest> requests = chatRequestService.getPendingReceivedChatRequests(currentUser);
        List<ChatRequestDTO> requestDTOs = requests.stream()
                .map(ChatRequestDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(requestDTOs);
    }
    
    @GetMapping("/sent")
    public ResponseEntity<List<ChatRequestDTO>> getSentRequests(@AuthenticationPrincipal User currentUser) {
        List<ChatRequest> requests = chatRequestService.getSentChatRequests(currentUser);
        List<ChatRequestDTO> requestDTOs = requests.stream()
                .map(ChatRequestDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(requestDTOs);
    }
    
    @GetMapping("/{requestId}")
    public ResponseEntity<ChatRequestDTO> getRequestById(@PathVariable UUID requestId) {
        ChatRequest request = chatRequestService.getChatRequestById(requestId);
        return ResponseEntity.ok(ChatRequestDTO.fromEntity(request));
    }
    
    @GetMapping("/can-chat/{userId}")
    public ResponseEntity<Boolean> canChatWithUser(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID userId) {
        
        // Find the user from repository instead of direct instantiation
        User otherUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User with ID " + userId + " not found"));
        
        boolean canChat = chatRequestService.canUsersChat(currentUser, otherUser);
        return ResponseEntity.ok(canChat);
    }
}