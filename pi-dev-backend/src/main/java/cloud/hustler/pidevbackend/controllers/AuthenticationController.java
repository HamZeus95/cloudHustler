package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.dto.AuthenticationRequest;
import cloud.hustler.pidevbackend.dto.AuthenticationResponse;
import cloud.hustler.pidevbackend.dto.RegisterRequest;
import cloud.hustler.pidevbackend.service.auth.IAuthenticationService;
import cloud.hustler.pidevbackend.service.auth.JwtServiceImplement;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    IAuthenticationService authenticationService;
    
    @Autowired
    JwtServiceImplement jwtService;
    
    @Autowired
    UserDetailsService userDetailsService;
    
    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request,
            HttpServletResponse response
    ) {
        AuthenticationResponse authResponse = authenticationService.register(request);
        
        // Set the refresh token in an HttpOnly cookie
        addRefreshTokenCookie(response, authResponse.getRefreshToken());
        
        // Return the auth response without the refresh token in the JSON body
        return ResponseEntity.ok(AuthenticationResponse.builder()
                .accessToken(authResponse.getAccessToken())
                .userResponse(authResponse.getUserResponse())
                .build());
    }
    
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request,
            HttpServletResponse response
    ) {
        AuthenticationResponse authResponse = authenticationService.authenticate(request);
        
        // Set the refresh token in an HttpOnly cookie
        addRefreshTokenCookie(response, authResponse.getRefreshToken());
        
        // Return the auth response without the refresh token in the JSON body
        return ResponseEntity.ok(AuthenticationResponse.builder()
                .accessToken(authResponse.getAccessToken())
                .userResponse(authResponse.getUserResponse())
                .build());
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        // Get refresh token from the cookie
        String refreshToken = extractRefreshTokenFromCookie(request);
        
        if (refreshToken == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Unauthorized");
            errorResponse.put("message", "No refresh token cookie found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
        
        try {
            // Process the refresh token
            AuthenticationResponse authResponse = authenticationService.refreshTokenFromCookie(refreshToken);
            
            // Update the refresh token cookie
            addRefreshTokenCookie(response, authResponse.getRefreshToken());
            
            // Return the new access token
            return ResponseEntity.ok(AuthenticationResponse.builder()
                    .accessToken(authResponse.getAccessToken())
                    .userResponse(authResponse.getUserResponse())
                    .build());
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Unauthorized");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Clear the refresh token cookie
        Cookie cookie = new Cookie("refresh_token", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // Set to true in production with HTTPS
        response.addCookie(cookie);
        
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("message", "Logged out successfully");
        
        return ResponseEntity.ok(responseBody);
    }
    
    @PostMapping("/validate-session")
    public ResponseEntity<?> validateSession(HttpServletRequest request, HttpServletResponse response) {
        try {
            // Extract token from Authorization header
            String authHeader = request.getHeader("Authorization");
            
            // If there's no Authorization header or it doesn't start with Bearer, try refresh token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                // Get refresh token from cookie
                String refreshToken = extractRefreshTokenFromCookie(request);
                if (refreshToken == null) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("valid", false);
                    errorResponse.put("message", "No valid token provided");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
                }
                
                // Try to refresh using the cookie
                AuthenticationResponse authResponse = authenticationService.refreshTokenFromCookie(refreshToken);
                
                // Update the refresh token cookie
                addRefreshTokenCookie(response, authResponse.getRefreshToken());
                
                return ResponseEntity.ok(AuthenticationResponse.builder()
                        .accessToken(authResponse.getAccessToken())
                        .userResponse(authResponse.getUserResponse())
                        .build());
            }
            
            // Extract the token
            String jwt = authHeader.substring(7);
            
            // Extract the username from the token
            String username = jwtService.extractUsername(jwt);
            
            // If no username, token is invalid
            if (username == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("valid", false);
                errorResponse.put("message", "Invalid token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            // Load the user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            // Validate the token
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // Create a response with user details and new tokens
                AuthenticationResponse authResponse = authenticationService.refreshUserSession(jwt, userDetails);
                
                // Set the refresh token in an HttpOnly cookie
                addRefreshTokenCookie(response, authResponse.getRefreshToken());
                
                // Return just the access token in the response body
                return ResponseEntity.ok(AuthenticationResponse.builder()
                        .accessToken(authResponse.getAccessToken())
                        .userResponse(authResponse.getUserResponse())
                        .build());
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("valid", false);
                errorResponse.put("message", "Token has expired");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("valid", false);
            errorResponse.put("message", "Session validation error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
    
    private void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setMaxAge((int) (refreshExpiration / 1000)); // Convert from ms to seconds
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setSecure(false); // Set to true in production with HTTPS
        response.addCookie(cookie);
    }
    
    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refresh_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
