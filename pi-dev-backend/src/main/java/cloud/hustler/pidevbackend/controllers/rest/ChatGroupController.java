package cloud.hustler.pidevbackend.controllers.rest;

import cloud.hustler.pidevbackend.dto.ChatGroupDTO;
import cloud.hustler.pidevbackend.dto.UserDTO;
import cloud.hustler.pidevbackend.entity.ChatGroup;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.service.chat.IChatGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chat/groups")
public class ChatGroupController {
    
    private final IChatGroupService chatGroupService;
    
    @Autowired
    public ChatGroupController(IChatGroupService chatGroupService) {
        this.chatGroupService = chatGroupService;
    }
    
    @PostMapping
    public ResponseEntity<ChatGroupDTO> createGroup(
            @AuthenticationPrincipal User currentUser,
            @RequestBody Map<String, String> payload) {
        
        String name = payload.get("name");
        String description = payload.get("description");
        
        ChatGroup group = chatGroupService.createGroup(currentUser, name, description);
        return ResponseEntity.ok(ChatGroupDTO.fromEntity(group, currentUser));
    }
    
    @GetMapping("/{groupId}")
    public ResponseEntity<ChatGroupDTO> getGroupById(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID groupId) {
        
        ChatGroup group = chatGroupService.getGroupById(groupId);
        return ResponseEntity.ok(ChatGroupDTO.fromEntity(group, currentUser));
    }
    
    @GetMapping
    public ResponseEntity<List<ChatGroupDTO>> getUserGroups(@AuthenticationPrincipal User currentUser) {
        List<ChatGroup> groups = chatGroupService.getUserGroups(currentUser);
        List<ChatGroupDTO> groupDTOs = groups.stream()
                .map(group -> ChatGroupDTO.fromEntitySimplified(group, currentUser))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(groupDTOs);
    }
    
    @GetMapping("/admin")
    public ResponseEntity<List<ChatGroupDTO>> getUserAdminGroups(@AuthenticationPrincipal User currentUser) {
        List<ChatGroup> groups = chatGroupService.getUserAdminGroups(currentUser);
        List<ChatGroupDTO> groupDTOs = groups.stream()
                .map(group -> ChatGroupDTO.fromEntitySimplified(group, currentUser))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(groupDTOs);
    }
    
    @PutMapping("/{groupId}")
    public ResponseEntity<ChatGroupDTO> updateGroup(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID groupId,
            @RequestBody Map<String, String> payload) {
        
        String name = payload.get("name");
        String description = payload.get("description");
        
        ChatGroup group = chatGroupService.updateGroup(groupId, name, description, currentUser);
        return ResponseEntity.ok(ChatGroupDTO.fromEntity(group, currentUser));
    }
    
    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteGroup(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID groupId) {
        
        boolean deleted = chatGroupService.deleteGroup(groupId, currentUser);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{groupId}/leave")
    public ResponseEntity<Void> leaveGroup(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID groupId) {
        
        boolean left = chatGroupService.leaveGroup(groupId, currentUser);
        if (left) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<ChatGroupDTO> addMemberToGroup(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID groupId,
            @PathVariable UUID userId) {
        
        ChatGroup group = chatGroupService.addMemberToGroup(groupId, userId, currentUser);
        return ResponseEntity.ok(ChatGroupDTO.fromEntity(group, currentUser));
    }
    
    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<ChatGroupDTO> removeMemberFromGroup(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID groupId,
            @PathVariable UUID userId) {
        
        ChatGroup group = chatGroupService.removeMemberFromGroup(groupId, userId, currentUser);
        return ResponseEntity.ok(ChatGroupDTO.fromEntity(group, currentUser));
    }
    
    @PostMapping("/{groupId}/admins/{userId}")
    public ResponseEntity<ChatGroupDTO> addAdminToGroup(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID groupId,
            @PathVariable UUID userId) {
        
        ChatGroup group = chatGroupService.addAdminToGroup(groupId, userId, currentUser);
        return ResponseEntity.ok(ChatGroupDTO.fromEntity(group, currentUser));
    }
    
    @DeleteMapping("/{groupId}/admins/{userId}")
    public ResponseEntity<ChatGroupDTO> removeAdminFromGroup(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID groupId,
            @PathVariable UUID userId) {
        
        ChatGroup group = chatGroupService.removeAdminFromGroup(groupId, userId, currentUser);
        return ResponseEntity.ok(ChatGroupDTO.fromEntity(group, currentUser));
    }
    
    @GetMapping("/{groupId}/members")
    public ResponseEntity<Set<UserDTO>> getGroupMembers(@PathVariable UUID groupId) {
        Set<User> members = chatGroupService.getGroupMembers(groupId);
        Set<UserDTO> memberDTOs = members.stream()
                .map(UserDTO::fromUser)
                .collect(Collectors.toSet());
        
        return ResponseEntity.ok(memberDTOs);
    }
    
    @GetMapping("/{groupId}/admins")
    public ResponseEntity<Set<UserDTO>> getGroupAdmins(@PathVariable UUID groupId) {
        Set<User> admins = chatGroupService.getGroupAdmins(groupId);
        Set<UserDTO> adminDTOs = admins.stream()
                .map(UserDTO::fromUser)
                .collect(Collectors.toSet());
        
        return ResponseEntity.ok(adminDTOs);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ChatGroupDTO>> searchGroups(
            @AuthenticationPrincipal User currentUser,
            @RequestParam String query) {
        
        List<ChatGroup> groups = chatGroupService.searchGroups(query);
        List<ChatGroupDTO> groupDTOs = groups.stream()
                .map(group -> ChatGroupDTO.fromEntitySimplified(group, currentUser))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(groupDTOs);
    }
    
    @GetMapping("/{groupId}/is-member")
    public ResponseEntity<Boolean> isUserMemberOfGroup(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID groupId) {
        
        boolean isMember = chatGroupService.isUserMemberOfGroup(groupId, currentUser);
        return ResponseEntity.ok(isMember);
    }
    
    @GetMapping("/{groupId}/is-admin")
    public ResponseEntity<Boolean> isUserAdminOfGroup(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID groupId) {
        
        boolean isAdmin = chatGroupService.isUserAdminOfGroup(groupId, currentUser);
        return ResponseEntity.ok(isAdmin);
    }
}