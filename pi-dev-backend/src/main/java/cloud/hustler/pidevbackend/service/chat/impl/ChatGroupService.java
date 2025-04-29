package cloud.hustler.pidevbackend.service.chat.impl;

import cloud.hustler.pidevbackend.entity.ChatGroup;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.ChatGroupRepository;
import cloud.hustler.pidevbackend.repository.UserRepository;
import cloud.hustler.pidevbackend.service.chat.IChatGroupService;
import cloud.hustler.pidevbackend.service.chat.IBlockedUserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class ChatGroupService implements IChatGroupService {

    private final ChatGroupRepository groupRepository;
    private final UserRepository userRepository;
    private final IBlockedUserService blockedUserService;

    @Autowired
    public ChatGroupService(
            ChatGroupRepository groupRepository,
            UserRepository userRepository,
            IBlockedUserService blockedUserService) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.blockedUserService = blockedUserService;
    }

    @Override
    @Transactional
    public ChatGroup createGroup(User creator, String name, String description) {
        ChatGroup group = new ChatGroup();
        group.setName(name);
        group.setDescription(description);
        group.setCreator(creator);
        group.setCreatedAt(LocalDateTime.now());
        
        // Add creator as member and admin
        group.addMember(creator);
        group.addAdmin(creator);
        
        return groupRepository.save(group);
    }

    @Override
    @Transactional
    public ChatGroup addMemberToGroup(UUID groupId, UUID userId, User currentUser) {
        ChatGroup group = getGroupById(groupId);
        
        // Check if current user is an admin
        if (!isUserAdminOfGroup(groupId, currentUser)) {
            throw new AccessDeniedException("Only admins can add members to the group");
        }
        
        User userToAdd = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        
        // Check if there's a blocking relationship
        if (blockedUserService.isBlockingRelationshipExists(currentUser, userToAdd)) {
            throw new AccessDeniedException("Cannot add user due to blocking relationship");
        }
        
        // Add user to the group
        group.addMember(userToAdd);
        return groupRepository.save(group);
    }

    @Override
    @Transactional
    public ChatGroup removeMemberFromGroup(UUID groupId, UUID userId, User currentUser) {
        ChatGroup group = getGroupById(groupId);
        
        // Check if current user is an admin
        if (!isUserAdminOfGroup(groupId, currentUser)) {
            throw new AccessDeniedException("Only admins can remove members from the group");
        }
        
        User userToRemove = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        
        // Check if user is a member
        if (!group.isMember(userToRemove)) {
            throw new IllegalStateException("User is not a member of this group");
        }
        
        // Can't remove the creator
        if (group.getCreator().equals(userToRemove)) {
            throw new AccessDeniedException("Cannot remove the group creator");
        }
        
        // Remove the user
        group.removeMember(userToRemove);
        return groupRepository.save(group);
    }

    @Override
    @Transactional
    public ChatGroup addAdminToGroup(UUID groupId, UUID userId, User currentUser) {
        ChatGroup group = getGroupById(groupId);
        
        // Only admins can add other admins
        if (!isUserAdminOfGroup(groupId, currentUser)) {
            throw new AccessDeniedException("Only admins can add other admins");
        }
        
        User userToPromote = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        
        // User must be a member first
        if (!group.isMember(userToPromote)) {
            throw new IllegalStateException("User must be a member before becoming an admin");
        }
        
        // Promote to admin
        group.addAdmin(userToPromote);
        return groupRepository.save(group);
    }

    @Override
    @Transactional
    public ChatGroup removeAdminFromGroup(UUID groupId, UUID userId, User currentUser) {
        ChatGroup group = getGroupById(groupId);
        
        // Only admins can remove other admins
        if (!isUserAdminOfGroup(groupId, currentUser)) {
            throw new AccessDeniedException("Only admins can remove other admins");
        }
        
        User userToDemote = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        
        // Can't demote the creator
        if (group.getCreator().equals(userToDemote)) {
            throw new AccessDeniedException("Cannot remove admin privileges from the group creator");
        }
        
        // Can't demote yourself if you're not the creator
        if (currentUser.equals(userToDemote) && !group.getCreator().equals(currentUser)) {
            throw new AccessDeniedException("Cannot remove your own admin privileges");
        }
        
        // Demote from admin
        group.removeAdmin(userToDemote);
        return groupRepository.save(group);
    }

    @Override
    public Set<User> getGroupMembers(UUID groupId) {
        ChatGroup group = getGroupById(groupId);
        return new HashSet<>(group.getMembers());
    }

    @Override
    public Set<User> getGroupAdmins(UUID groupId) {
        ChatGroup group = getGroupById(groupId);
        return new HashSet<>(group.getAdmins());
    }

    @Override
    public List<ChatGroup> getUserGroups(User user) {
        return groupRepository.findGroupsWhereUserIsMember(user);
    }

    @Override
    public List<ChatGroup> getUserAdminGroups(User user) {
        return groupRepository.findGroupsWhereUserIsAdmin(user);
    }

    @Override
    public ChatGroup getGroupById(UUID groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Group not found with ID: " + groupId));
    }

    @Override
    @Transactional
    public ChatGroup updateGroup(UUID groupId, String name, String description, User currentUser) {
        ChatGroup group = getGroupById(groupId);
        
        // Check if current user is an admin
        if (!isUserAdminOfGroup(groupId, currentUser)) {
            throw new AccessDeniedException("Only admins can update group details");
        }
        
        // Update fields
        if (name != null && !name.trim().isEmpty()) {
            group.setName(name);
        }
        
        if (description != null) {
            group.setDescription(description);
        }
        
        return groupRepository.save(group);
    }

    @Override
    @Transactional
    public boolean deleteGroup(UUID groupId, User currentUser) {
        ChatGroup group = getGroupById(groupId);
        
        // Only the creator can delete the group
        if (!group.getCreator().equals(currentUser)) {
            throw new AccessDeniedException("Only the creator can delete the group");
        }
        
        groupRepository.delete(group);
        return true;
    }

    @Override
    @Transactional
    public boolean leaveGroup(UUID groupId, User user) {
        ChatGroup group = getGroupById(groupId);
        
        // Check if user is a member
        if (!group.isMember(user)) {
            throw new IllegalStateException("User is not a member of this group");
        }
        
        // Creator cannot leave the group
        if (group.getCreator().equals(user)) {
            throw new AccessDeniedException("The creator cannot leave the group. Delete it instead.");
        }
        
        // Remove user from group
        group.removeMember(user);
        groupRepository.save(group);
        return true;
    }

    @Override
    public boolean isUserMemberOfGroup(UUID groupId, User user) {
        ChatGroup group = getGroupById(groupId);
        return group.isMember(user);
    }

    @Override
    public boolean isUserAdminOfGroup(UUID groupId, User user) {
        ChatGroup group = getGroupById(groupId);
        return group.isAdmin(user);
    }

    @Override
    public List<ChatGroup> searchGroups(String searchTerm) {
        return groupRepository.findByNameContainingIgnoreCase(searchTerm);
    }
}