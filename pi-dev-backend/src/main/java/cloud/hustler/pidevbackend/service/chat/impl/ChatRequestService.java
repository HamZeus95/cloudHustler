package cloud.hustler.pidevbackend.service.chat.impl;

import cloud.hustler.pidevbackend.entity.ChatRequest;
import cloud.hustler.pidevbackend.entity.ChatRequestStatus;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.ChatRequestRepository;
import cloud.hustler.pidevbackend.repository.UserRepository;
import cloud.hustler.pidevbackend.service.chat.IBlockedUserService;
import cloud.hustler.pidevbackend.service.chat.IChatRequestService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ChatRequestService implements IChatRequestService {

    private final ChatRequestRepository chatRequestRepository;
    private final UserRepository userRepository;
    private final IBlockedUserService blockedUserService;

    @Autowired
    public ChatRequestService(
            ChatRequestRepository chatRequestRepository,
            UserRepository userRepository,
            IBlockedUserService blockedUserService) {
        this.chatRequestRepository = chatRequestRepository;
        this.userRepository = userRepository;
        this.blockedUserService = blockedUserService;
    }

    @Override
    @Transactional
    public ChatRequest sendChatRequest(User sender, UUID receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + receiverId));

        // Check if users have blocked each other
        if (blockedUserService.isBlockingRelationshipExists(sender, receiver)) {
            throw new AccessDeniedException("Cannot send chat request due to blocking relationship");
        }

        // Check if there's already a chat request
        if (chatRequestRepository.existsBySenderAndReceiver(sender, receiver)) {
            throw new IllegalStateException("Chat request already exists between these users");
        }

        // Check if already approved chat exists
        if (chatRequestRepository.existsApprovedChatBetweenUsers(sender, receiver)) {
            throw new IllegalStateException("Approved chat already exists between these users");
        }

        ChatRequest chatRequest = new ChatRequest();
        chatRequest.setSender(sender);
        chatRequest.setReceiver(receiver);
        chatRequest.setStatus(ChatRequestStatus.PENDING);
        chatRequest.setCreatedAt(LocalDateTime.now());

        return chatRequestRepository.save(chatRequest);
    }

    @Override
    @Transactional
    public ChatRequest approveChatRequest(UUID requestId, User user) {
        ChatRequest request = getChatRequestById(requestId);

        // Validate the user is the receiver
        if (!request.getReceiver().equals(user)) {
            throw new AccessDeniedException("Only the receiver can approve the chat request");
        }

        // Validate the status is pending
        if (request.getStatus() != ChatRequestStatus.PENDING) {
            throw new IllegalStateException("Only pending requests can be approved");
        }

        // Approve the request
        request.approve();
        return chatRequestRepository.save(request);
    }

    @Override
    @Transactional
    public ChatRequest rejectChatRequest(UUID requestId, User user) {
        ChatRequest request = getChatRequestById(requestId);

        // Validate the user is the receiver
        if (!request.getReceiver().equals(user)) {
            throw new AccessDeniedException("Only the receiver can reject the chat request");
        }

        // Validate the status is pending
        if (request.getStatus() != ChatRequestStatus.PENDING) {
            throw new IllegalStateException("Only pending requests can be rejected");
        }

        // Reject the request
        request.reject();
        return chatRequestRepository.save(request);
    }

    @Override
    public List<ChatRequest> getReceivedChatRequests(User user) {
        return chatRequestRepository.findByReceiver(user);
    }

    @Override
    public List<ChatRequest> getPendingReceivedChatRequests(User user) {
        return chatRequestRepository.findByReceiverAndStatus(user, ChatRequestStatus.PENDING);
    }

    @Override
    public List<ChatRequest> getSentChatRequests(User user) {
        return chatRequestRepository.findBySender(user);
    }

    @Override
    public boolean canUsersChat(User user1, User user2) {
        // Users can chat if they don't have a blocking relationship and have an approved chat request
        return !blockedUserService.isBlockingRelationshipExists(user1, user2) &&
                chatRequestRepository.existsApprovedChatBetweenUsers(user1, user2);
    }

    @Override
    public ChatRequest getChatRequestById(UUID requestId) {
        return chatRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Chat request not found with ID: " + requestId));
    }
}