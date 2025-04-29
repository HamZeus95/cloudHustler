package cloud.hustler.pidevbackend.config;

import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    @Autowired
    private JwtDecoder jwtDecoder;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Extract authorization header
            List<String> authorizationHeaders = accessor.getNativeHeader("Authorization");
            if (authorizationHeaders != null && !authorizationHeaders.isEmpty()) {
                String bearerToken = authorizationHeaders.get(0);
                
                // Check if token has Bearer prefix and extract the actual token
                if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
                    String token = bearerToken.substring(7);
                    try {
                        // Validate and decode JWT token
                        Jwt jwt = jwtDecoder.decode(token);
                        
                        // Extract user information from JWT claims
                        String userIdClaim = (String) jwt.getClaims().get("sub");
                        UUID userId = UUID.fromString(userIdClaim);
                        
                        // Find user in repository
                        Optional<User> userOptional = userRepository.findById(userId);
                        if (userOptional.isPresent()) {
                            User user = userOptional.get();
                            
                            // Create authentication object and set it in the security context
                            Authentication auth = new UsernamePasswordAuthenticationToken(
                                user, null, user.getAuthorities());
                            SecurityContextHolder.getContext().setAuthentication(auth);
                            
                            // Also set it in the accessor for WebSocket session
                            accessor.setUser(auth);
                        }
                    } catch (Exception e) {
                        // Log error but allow connection
                        System.err.println("Invalid JWT token in WebSocket connection: " + e.getMessage());
                    }
                }
            }
        }
        
        return message;
    }
}