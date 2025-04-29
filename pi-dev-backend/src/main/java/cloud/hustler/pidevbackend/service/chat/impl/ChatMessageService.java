package cloud.hustler.pidevbackend.service.chat.impl;

import cloud.hustler.pidevbackend.entity.ChatGroup;
import cloud.hustler.pidevbackend.entity.ChatMessage;
import cloud.hustler.pidevbackend.entity.MessageType;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.ChatGroupRepository;
import cloud.hustler.pidevbackend.repository.ChatMessageRepository;
import cloud.hustler.pidevbackend.repository.UserRepository;
import cloud.hustler.pidevbackend.service.chat.IChatGroupService;
import cloud.hustler.pidevbackend.service.chat.IChatMessageService;
import cloud.hustler.pidevbackend.service.chat.IChatRequestService;
import cloud.hustler.pidevbackend.service.chat.IBlockedUserService;
import cloud.hustler.pidevbackend.service.chat.EncryptionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChatMessageService implements IChatMessageService {

    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ChatGroupRepository groupRepository;
    private final EncryptionService encryptionService;
    private final IChatRequestService chatRequestService;
    private final IBlockedUserService blockedUserService;
    
    // Track the last read time for each user in each group
    private final Map<String, LocalDateTime> userGroupLastReadTime = new HashMap<>();

    @Autowired
    public ChatMessageService(
            ChatMessageRepository messageRepository,
            UserRepository userRepository,
            ChatGroupRepository groupRepository,
            EncryptionService encryptionService,
            IChatRequestService chatRequestService,
            IBlockedUserService blockedUserService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.encryptionService = encryptionService;
        this.chatRequestService = chatRequestService;
        this.blockedUserService = blockedUserService;
    }

    @Override
    @Transactional
    public ChatMessage sendDirectMessage(User sender, UUID receiverId, String content, MessageType messageType) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + receiverId));
        
        // Check if users can chat (if they have an approved request and no blocking)
        if (!chatRequestService.canUsersChat(sender, receiver)) {
            throw new AccessDeniedException("Cannot send message: No approved chat request or users have blocked each other");
        }
        
        // Encrypt the message content
        String encryptedContent = encryptionService.encrypt(content);
        
        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setEncryptedContent(encryptedContent);
        message.setMessageType(messageType);
        message.setTimestamp(LocalDateTime.now());
        message.setRead(false);
        
        return messageRepository.save(message);
    }

    @Override
    @Transactional
    public ChatMessage sendGroupMessage(User sender, UUID groupId, String content, MessageType messageType) {
        ChatGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Group not found with ID: " + groupId));
        
        // Check if user is a member of the group
        if (!group.isMember(sender)) {
            throw new AccessDeniedException("User is not a member of this group");
        }
        
        // Encrypt the message content
        String encryptedContent = encryptionService.encrypt(content);
        
        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setGroup(group);
        message.setEncryptedContent(encryptedContent);
        message.setMessageType(messageType);
        message.setTimestamp(LocalDateTime.now());
        
        return messageRepository.save(message);
    }

    @Override
    public Page<ChatMessage> getDirectMessagesBetweenUsers(User user1, User user2, Pageable pageable) {
        // Check if users can chat
        if (!chatRequestService.canUsersChat(user1, user2)) {
            throw new AccessDeniedException("No approved chat request between users");
        }
        
        // Get messages and decrypt their content
        Page<ChatMessage> messages = messageRepository.findDirectMessagesBetweenUsers(user1, user2, pageable);
        
        // Note: In a real application, we might want to decrypt messages only when needed
        // rather than all at once, especially with large datasets
        messages.forEach(this::decryptMessage);
        
        return messages;
    }

    @Override
    public Page<ChatMessage> getGroupMessages(UUID groupId, Pageable pageable) {
        ChatGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Group not found with ID: " + groupId));
        
        // Get messages and decrypt their content
        Page<ChatMessage> messages = Page.empty();
        List<ChatMessage> messagesList = messageRepository.findByGroupOrderByTimestampDesc(group, pageable);
        
        if (!messagesList.isEmpty()) {
            messages = new org.springframework.data.domain.PageImpl<>(
                messagesList, pageable, messageRepository.count()
            );
        }
        
        // Decrypt messages
        messages.forEach(this::decryptMessage);
        
        return messages;
    }
    
    // Helper method to decrypt message content
    private void decryptMessage(ChatMessage message) {
        try {
            String decryptedContent = encryptionService.decrypt(message.getEncryptedContent());
            // Store in a transient field or attach to the DTO
            message.setEncryptedContent(decryptedContent); // Note: In production, might use a DTO instead
        } catch (Exception e) {
            // Log error but don't expose it
            message.setEncryptedContent("[Encryption error: Message cannot be displayed]");
        }
    }

    @Override
    @Transactional
    public ChatMessage markMessageAsRead(UUID messageId, User user) {
        ChatMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message not found with ID: " + messageId));
        
        // Only the receiver can mark a message as read
        if (message.isDirectMessage() && !message.getReceiver().equals(user)) {
            throw new AccessDeniedException("Only the receiver can mark a message as read");
        }
        
        // Update message if not already read
        if (!message.isRead()) {
            message.markAsRead();
            return messageRepository.save(message);
        }
        
        return message;
    }

    @Override
    @Transactional
    public int markAllMessagesFromSenderAsRead(User sender, User receiver) {
        // Find all unread messages from sender to receiver
        List<ChatMessage> unreadMessages = messageRepository.findUnreadMessagesForUser(receiver)
                .stream()
                .filter(m -> m.getSender().equals(sender))
                .toList();
        
        // Mark all as read
        for (ChatMessage message : unreadMessages) {
            message.markAsRead();
            messageRepository.save(message);
        }
        
        return unreadMessages.size();
    }

    @Override
    public long getUnreadMessageCount(User user) {
        return messageRepository.countUnreadMessagesForUser(user);
    }

    @Override
    public long getUnreadMessageCountFromSender(User sender, User receiver) {
        return messageRepository.countUnreadMessagesFromSender(receiver, sender);
    }

    @Override
    public List<ChatMessage> getUnreadGroupMessages(UUID groupId, User user) {
        ChatGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Group not found with ID: " + groupId));
        
        // Get last read time or default to epoch start
        LocalDateTime lastReadTime = userGroupLastReadTime
                .getOrDefault(createUserGroupKey(user.getUuid_user(), groupId), LocalDateTime.MIN);
        
        // Get unread messages
        List<ChatMessage> unreadMessages = messageRepository.findUnreadGroupMessages(group, user, lastReadTime);
        
        // Update last read time
        userGroupLastReadTime.put(createUserGroupKey(user.getUuid_user(), groupId), LocalDateTime.now());
        
        // Decrypt messages
        unreadMessages.forEach(this::decryptMessage);
        
        return unreadMessages;
    }
    
    // Helper method to create a key for the user-group last read time map
    private String createUserGroupKey(UUID userId, UUID groupId) {
        return userId.toString() + "-" + groupId.toString();
    }

    @Override
    public long getUnreadGroupMessageCount(UUID groupId, User user) {
        ChatGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Group not found with ID: " + groupId));
        
        LocalDateTime lastReadTime = userGroupLastReadTime
                .getOrDefault(createUserGroupKey(user.getUuid_user(), groupId), LocalDateTime.MIN);
        
        return messageRepository.countUnreadGroupMessages(group, user, lastReadTime);
    }

    @Override
    public ChatMessage getMessageById(UUID messageId) {
        ChatMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message not found with ID: " + messageId));
        
        decryptMessage(message);
        return message;
    }

    @Override
    @Transactional
    public boolean deleteMessage(UUID messageId, User user) {
        ChatMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message not found with ID: " + messageId));
        
        // Only the sender can delete a message
        if (!message.getSender().equals(user)) {
            throw new AccessDeniedException("Only the sender can delete the message");
        }
        
        messageRepository.delete(message);
        return true;
    }
}