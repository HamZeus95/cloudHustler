package cloud.hustler.pidevbackend.service.chat;

import cloud.hustler.pidevbackend.entity.ChatGroup;
import cloud.hustler.pidevbackend.entity.User;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface IChatGroupService {
    
    /**
     * Create a new chat group
     * 
     * @param creator The user creating the group
     * @param name Group name
     * @param description Group description (optional)
     * @return The created chat group
     */
    ChatGroup createGroup(User creator, String name, String description);
    
    /**
     * Add a user to a group
     * 
     * @param groupId Group ID
     * @param userId User ID to add
     * @param currentUser User performing the action (must be an admin)
     * @return The updated group
     */
    ChatGroup addMemberToGroup(UUID groupId, UUID userId, User currentUser);
    
    /**
     * Remove a user from a group
     * 
     * @param groupId Group ID
     * @param userId User ID to remove
     * @param currentUser User performing the action (must be an admin)
     * @return The updated group
     */
    ChatGroup removeMemberFromGroup(UUID groupId, UUID userId, User currentUser);
    
    /**
     * Make a user an admin of a group
     * 
     * @param groupId Group ID
     * @param userId User ID to promote
     * @param currentUser User performing the action (must be an admin)
     * @return The updated group
     */
    ChatGroup addAdminToGroup(UUID groupId, UUID userId, User currentUser);
    
    /**
     * Remove admin privileges from a user
     * 
     * @param groupId Group ID
     * @param userId User ID to demote
     * @param currentUser User performing the action (must be an admin)
     * @return The updated group
     */
    ChatGroup removeAdminFromGroup(UUID groupId, UUID userId, User currentUser);
    
    /**
     * Get all members of a group
     * 
     * @param groupId Group ID
     * @return Set of group members
     */
    Set<User> getGroupMembers(UUID groupId);
    
    /**
     * Get all admins of a group
     * 
     * @param groupId Group ID
     * @return Set of group admins
     */
    Set<User> getGroupAdmins(UUID groupId);
    
    /**
     * Get all groups a user is a member of
     * 
     * @param user The user
     * @return List of groups
     */
    List<ChatGroup> getUserGroups(User user);
    
    /**
     * Get all groups a user is an admin of
     * 
     * @param user The user
     * @return List of groups
     */
    List<ChatGroup> getUserAdminGroups(User user);
    
    /**
     * Get a group by ID
     * 
     * @param groupId Group ID
     * @return The group
     */
    ChatGroup getGroupById(UUID groupId);
    
    /**
     * Update group details
     * 
     * @param groupId Group ID
     * @param name New group name
     * @param description New group description
     * @param currentUser User performing the action (must be an admin)
     * @return The updated group
     */
    ChatGroup updateGroup(UUID groupId, String name, String description, User currentUser);
    
    /**
     * Delete a group
     * 
     * @param groupId Group ID
     * @param currentUser User performing the action (must be an admin)
     * @return True if deleted, false otherwise
     */
    boolean deleteGroup(UUID groupId, User currentUser);
    
    /**
     * Leave a group
     * 
     * @param groupId Group ID
     * @param user User leaving the group
     * @return True if left successfully, false otherwise
     */
    boolean leaveGroup(UUID groupId, User user);
    
    /**
     * Check if user is a member of a group
     * 
     * @param groupId Group ID
     * @param user User to check
     * @return True if user is a member, false otherwise
     */
    boolean isUserMemberOfGroup(UUID groupId, User user);
    
    /**
     * Check if user is an admin of a group
     * 
     * @param groupId Group ID
     * @param user User to check
     * @return True if user is an admin, false otherwise
     */
    boolean isUserAdminOfGroup(UUID groupId, User user);
    
    /**
     * Search for groups by name
     * 
     * @param searchTerm Search term
     * @return List of matching groups
     */
    List<ChatGroup> searchGroups(String searchTerm);
}