package cloud.hustler.pidevbackend.config;

import cloud.hustler.pidevbackend.service.auth.JwtServiceImplement;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    JwtServiceImplement jwtService;
    
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        // Skip authentication for auth endpoints and error pages
        String path = request.getServletPath();
        if (path.contains("/auth") || path.contains("/error")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        final String authHeader = request.getHeader("Authorization");
        
        // If no auth header or not a Bearer token, just continue the filter chain
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // At this point we have a Bearer token, extract and validate it
        try {
            final String jwt = authHeader.substring(7);
            
            // Validate JWT format (should have 2 dots)
            if (!isValidJwtFormat(jwt)) {
                log.warn("Malformed JWT token received: {}", jwt);
                filterChain.doFilter(request, response);
                return;
            }
            
            final String userEmail = jwtService.extractUsername(jwt);
            
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (MalformedJwtException e) {
            log.error("Malformed JWT: {}", e.getMessage());
        } catch (JwtException e) {
            log.error("JWT error: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Authentication error: {}", e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
    
    /**
     * Check if a string has valid JWT format (contains exactly 2 periods)
     * @param token The token to validate
     * @return true if valid format, false otherwise
     */
    private boolean isValidJwtFormat(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }
        
        // A valid JWT has exactly 2 periods (3 parts: header, payload, signature)
        long periodCount = token.chars().filter(ch -> ch == '.').count();
        return periodCount == 2;
    }
}
