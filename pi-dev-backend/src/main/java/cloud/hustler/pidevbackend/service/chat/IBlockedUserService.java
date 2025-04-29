package cloud.hustler.pidevbackend.service.chat;

import cloud.hustler.pidevbackend.entity.BlockedUser;
import cloud.hustler.pidevbackend.entity.User;

import java.util.List;
import java.util.UUID;

public interface IBlockedUserService {
    
    /**
     * Block a user
     * 
     * @param blocker The user performing the block
     * @param blockedId The ID of the user to block
     * @param reason Optional reason for blocking
     * @return The created blocked user relationship
     */
    BlockedUser blockUser(User blocker, UUID blockedId, String reason);
    
    /**
     * Unblock a previously blocked user
     * 
     * @param blocker The user performing the unblock
     * @param blockedId The ID of the user to unblock
     * @return true if successful, false otherwise
     */
    boolean unblockUser(User blocker, UUID blockedId);
    
    /**
     * Get all users blocked by a specific user
     * 
     * @param user The user
     * @return List of blocked user relationships
     */
    List<BlockedUser> getBlockedUsers(User user);
    
    /**
     * Check if a user is blocked by another user
     * 
     * @param blocker The potential blocking user
     * @param blocked The potential blocked user
     * @return true if the user is blocked, false otherwise
     */
    boolean isUserBlocked(User blocker, User blocked);
    
    /**
     * Get users who have blocked a specific user
     * 
     * @param user The potentially blocked user
     * @return List of users who have blocked this user
     */
    List<User> getUsersWhoBlockedUser(User user);
    
    /**
     * Check if either user has blocked the other (in any direction)
     * 
     * @param user1 First user
     * @param user2 Second user
     * @return true if blocking exists in either direction, false otherwise
     */
    boolean isBlockingRelationshipExists(User user1, User user2);
}