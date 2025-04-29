package cloud.hustler.pidevbackend.service.chat.impl;

import cloud.hustler.pidevbackend.entity.BlockedUser;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.BlockedUserRepository;
import cloud.hustler.pidevbackend.repository.UserRepository;
import cloud.hustler.pidevbackend.service.chat.IBlockedUserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BlockedUserService implements IBlockedUserService {

    private final BlockedUserRepository blockedUserRepository;
    private final UserRepository userRepository;

    @Autowired
    public BlockedUserService(
            BlockedUserRepository blockedUserRepository,
            UserRepository userRepository) {
        this.blockedUserRepository = blockedUserRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public BlockedUser blockUser(User blocker, UUID blockedId, String reason) {
        // Get blocked user
        User blocked = userRepository.findById(blockedId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + blockedId));

        // Check if already blocked
        if (isUserBlocked(blocker, blocked)) {
            throw new IllegalStateException("User is already blocked");
        }

        // Create and save the blocked user relationship
        BlockedUser blockedUser = new BlockedUser();
        blockedUser.setBlocker(blocker);
        blockedUser.setBlocked(blocked);
        blockedUser.setReason(reason);

        return blockedUserRepository.save(blockedUser);
    }

    @Override
    @Transactional
    public boolean unblockUser(User blocker, UUID blockedId) {
        User blocked = userRepository.findById(blockedId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + blockedId));

        if (!isUserBlocked(blocker, blocked)) {
            return false; // User was not blocked
        }

        blockedUserRepository.deleteByBlockerAndBlocked(blocker, blocked);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlockedUser> getBlockedUsers(User user) {
        // Detach the entities from the session to prevent lazy loading attempts
        List<BlockedUser> blockedUsers = blockedUserRepository.findByBlockerWithEagerFetch(user);
        
        // Return the fetched users with eager loading applied
        return blockedUsers;
    }

    @Override
    public boolean isUserBlocked(User blocker, User blocked) {
        return blockedUserRepository.existsByBlockerAndBlocked(blocker, blocked);
    }

    @Override
    public List<User> getUsersWhoBlockedUser(User user) {
        return blockedUserRepository.findByBlocked(user)
                .stream()
                .map(BlockedUser::getBlocker)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isBlockingRelationshipExists(User user1, User user2) {
        return isUserBlocked(user1, user2) || isUserBlocked(user2, user1);
    }
}