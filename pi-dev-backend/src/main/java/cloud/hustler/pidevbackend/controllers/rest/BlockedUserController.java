package cloud.hustler.pidevbackend.controllers.rest;

import cloud.hustler.pidevbackend.dto.BlockedUserDTO;
import cloud.hustler.pidevbackend.dto.UserDTO;
import cloud.hustler.pidevbackend.entity.BlockedUser;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.UserRepository;
import cloud.hustler.pidevbackend.service.chat.IBlockedUserService;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/chat/blocked-users")
public class BlockedUserController {
    
    private final IBlockedUserService blockedUserService;
    private final UserRepository userRepository;
    
    @Autowired
    public BlockedUserController(IBlockedUserService blockedUserService, UserRepository userRepository) {
        this.blockedUserService = blockedUserService;
        this.userRepository = userRepository;
    }
    
    @PostMapping("/{userId}")
    public ResponseEntity<BlockedUserDTO> blockUser(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID userId,
            @RequestBody(required = false) Map<String, String> payload) {
        
        String reason = payload != null ? payload.get("reason") : null;
        BlockedUser blockedUser = blockedUserService.blockUser(currentUser, userId, reason);
        return ResponseEntity.ok(BlockedUserDTO.fromEntity(blockedUser));
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> unblockUser(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID userId) {
        
        boolean unblocked = blockedUserService.unblockUser(currentUser, userId);
        if (unblocked) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<BlockedUserDTO>> getBlockedUsers(@AuthenticationPrincipal User currentUser) {
        System.out.println("Fetching blocked users for: " + currentUser);
        try {
            List<BlockedUser> blockedUsers = blockedUserService.getBlockedUsers(currentUser);
            List<BlockedUserDTO> blockedUserDTOs = blockedUsers.stream()
                    .map(BlockedUserDTO::fromEntity)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(blockedUserDTOs);
        } catch (Exception e) {
            System.err.println("Error fetching blocked users: " + e.getMessage());
            e.printStackTrace();
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching blocked users", e);
        }
    }
    
    @GetMapping("/is-blocked/{userId}")
    public ResponseEntity<Boolean> isUserBlocked(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID userId) {
        
        // Fetch the user from repository instead of direct instantiation
        User userToCheck = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User with ID " + userId + " not found"));
        
        boolean isBlocked = blockedUserService.isUserBlocked(currentUser, userToCheck);
        return ResponseEntity.ok(isBlocked);
    }
    
    @GetMapping("/is-blocking-relationship/{userId}")
    public ResponseEntity<Boolean> isBlockingRelationshipExists(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID userId) {
        
        // Fetch the user from repository instead of direct instantiation
        User userToCheck = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User with ID " + userId + " not found"));
        
        boolean relationshipExists = blockedUserService.isBlockingRelationshipExists(currentUser, userToCheck);
        return ResponseEntity.ok(relationshipExists);
    }
    
    @GetMapping("/blocked-by")
    public ResponseEntity<List<UserDTO>> getUsersWhoBlockedUser(@AuthenticationPrincipal User currentUser) {
        List<User> users = blockedUserService.getUsersWhoBlockedUser(currentUser);
        List<UserDTO> userDTOs = users.stream()
                .map(UserDTO::fromUser)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(userDTOs);
    }
}