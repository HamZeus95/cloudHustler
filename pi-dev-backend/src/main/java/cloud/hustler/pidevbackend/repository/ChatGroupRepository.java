package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.ChatGroup;
import cloud.hustler.pidevbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatGroupRepository extends JpaRepository<ChatGroup, UUID> {
    
    // Find groups created by a specific user
    List<ChatGroup> findByCreator(User creator);
    
    // Find groups where a user is a member
    @Query("SELECT g FROM ChatGroup g JOIN g.members m WHERE m = :user")
    List<ChatGroup> findGroupsWhereUserIsMember(@Param("user") User user);
    
    // Find groups where a user is an admin
    @Query("SELECT g FROM ChatGroup g JOIN g.admins a WHERE a = :user")
    List<ChatGroup> findGroupsWhereUserIsAdmin(@Param("user") User user);
    
    // Search groups by name (case insensitive, partial match)
    List<ChatGroup> findByNameContainingIgnoreCase(String name);
    
    // Check if user is a member of a group
    @Query("SELECT CASE WHEN COUNT(g) > 0 THEN true ELSE false END FROM ChatGroup g JOIN g.members m WHERE g = :group AND m = :user")
    boolean isUserMember(@Param("group") ChatGroup group, @Param("user") User user);
    
    // Check if user is an admin of a group
    @Query("SELECT CASE WHEN COUNT(g) > 0 THEN true ELSE false END FROM ChatGroup g JOIN g.admins a WHERE g = :group AND a = :user")
    boolean isUserAdmin(@Param("group") ChatGroup group, @Param("user") User user);
}