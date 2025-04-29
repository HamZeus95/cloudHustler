package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "chat_groups")
public class ChatGroup {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;
    
    @Column(nullable = false)
    String name;
    
    String description;
    
    @Column(nullable = false)
    LocalDateTime createdAt = LocalDateTime.now();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    User creator;
    
    @ManyToMany
    @JoinTable(
        name = "group_admins",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    Set<User> admins = new HashSet<>();
    
    @ManyToMany
    @JoinTable(
        name = "group_members",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    Set<User> members = new HashSet<>();
    
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ChatMessage> messages = new ArrayList<>();
    
    // Helper methods
    public void addMember(User user) {
        members.add(user);
    }
    
    public void removeMember(User user) {
        members.remove(user);
        // Also remove from admins if present
        admins.remove(user);
    }
    
    public void addAdmin(User user) {
        // Ensure user is a member before making them an admin
        if (members.contains(user)) {
            admins.add(user);
        }
    }
    
    public void removeAdmin(User user) {
        admins.remove(user);
    }
    
    public boolean isMember(User user) {
        return members.contains(user);
    }
    
    public boolean isAdmin(User user) {
        return admins.contains(user);
    }
    
    // Override equals and hashCode to use only the ID for comparison
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatGroup chatGroup = (ChatGroup) o;
        return Objects.equals(id, chatGroup.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    // Custom toString to avoid circular references
    @Override
    public String toString() {
        return "ChatGroup{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", createdAt=" + createdAt +
                ", creatorId=" + (creator != null ? creator.getUuid_user() : null) +
                ", membersCount=" + (members != null ? members.size() : 0) +
                ", adminsCount=" + (admins != null ? admins.size() : 0) +
                '}';
    }
}