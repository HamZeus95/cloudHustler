package cloud.hustler.pidevbackend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

/*@Entity
@Getter
@Setter
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)*/

public class Token {
  /*  @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    UUID uuid_tokrn;

    @Column(unique=true)
    String token;

    @Enumerated(EnumType.STRING)
    TokenType type = TokenType.BEARER;

    boolean revoked;
    boolean expired;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_uuid")
    User user;

 */
}
