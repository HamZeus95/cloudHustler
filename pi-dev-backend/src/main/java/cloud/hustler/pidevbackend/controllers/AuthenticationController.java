package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.dto.*;
import cloud.hustler.pidevbackend.entity.Otp;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.OtpRepository;
import cloud.hustler.pidevbackend.repository.UserRepository;
import cloud.hustler.pidevbackend.service.IFaceIdService;
import cloud.hustler.pidevbackend.service.auth.AuthenticationServiceImplement;
import cloud.hustler.pidevbackend.service.auth.JwtServiceImplement;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    AuthenticationServiceImplement authenticationService;
    
    @Autowired
    JwtServiceImplement jwtService;
    
    @Autowired
    UserDetailsService userDetailsService;
    
    @Autowired
    UserRepository userRepository;

    @Autowired
    OtpRepository otpRepository;
    
    @Autowired
    private IFaceIdService faceIdServiceImpl;
    
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
        
        // Return the auth response with the access token but without the refresh token in the JSON body
        return ResponseEntity.ok(AuthenticationResponse.builder()
                .accessToken(authResponse.getAccessToken())
                .userResponse(authResponse.getUserResponse())
                .build());
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerificationRequest request) {
        boolean isVerified = authenticationService.verifyOtp(request.getOtpValue(), request.getEmail());
        
        if (isVerified) {
            // If OTP verification is successful, find the user and return their updated info with tokens
            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));
            
            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);
            
            // Return success response with new tokens
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Email verification successful");
            response.put("accessToken", jwtToken);
            response.put("refreshToken", refreshToken);
            response.put("user", user);
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid or expired OTP");
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
            
            // Generate new OTP and send email
            var otp = authenticationService.generateOtp(user);
            authenticationService.sendOtpEmail(user, otp.getOtpValue());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "OTP has been sent to your email");
            
            return ResponseEntity.ok(response);
        } catch (MessagingException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to send OTP email");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (UsernameNotFoundException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(
            @RequestBody AuthenticationRequest request,
            HttpServletResponse response
    ) {
        try {
            AuthenticationResponse authResponse = authenticationService.authenticate(request);
            
            // Set the refresh token in an HttpOnly cookie
            addRefreshTokenCookie(response, authResponse.getRefreshToken());
            
            // Return the auth response without the refresh token in the JSON body
            return ResponseEntity.ok(AuthenticationResponse.builder()
                    .accessToken(authResponse.getAccessToken())
                    .userResponse(authResponse.getUserResponse())
                    .build());
                    
        } catch (UsernameNotFoundException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (RuntimeException e) {
            // This will catch the account not verified exception
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            // If this is an account verification error, also include the email
            if (e.getMessage().contains("Account not verified")) {
                errorResponse.put("requiresVerification", true);
                errorResponse.put("email", request.getEmail());
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Authentication failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
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
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // Create a cookie with matching parameters to clear the refresh token
        Cookie cookie = new Cookie("refresh_token", "");
        cookie.setMaxAge(0);  // Expire immediately
        cookie.setPath("/");  // Same path as original
        cookie.setHttpOnly(true); // Same HttpOnly setting as original
        // Don't set domain for localhost
        
        // Add the cookie to the response
        response.addCookie(cookie);
        
        // Add specific header for SameSite=Lax attribute (matching original cookie)
        response.addHeader("Set-Cookie", 
            "refresh_token=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax");

        // Return success response
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("message", "Logged out successfully");
        responseBody.put("status", "success");
        
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
    
    @GetMapping("/check-otp/{email}")
    public ResponseEntity<?> checkOtpStatus(@PathVariable String email) {
        try {
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
            
            // Get all OTPs for this user
            List<Otp> otps = otpRepository.findAll().stream()
                    .filter(otp -> otp.getUser() != null &&
                            otp.getUser().getEmail() != null &&
                            otp.getUser().getEmail().equals(email))
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("userEmail", email);
            response.put("userActive", user.isActif());
            response.put("otpCount", otps.size());
            
            if (!otps.isEmpty()) {
                List<Map<String, Object>> otpDetails = otps.stream()
                    .map(otp -> {
                        Map<String, Object> details = new HashMap<>();
                        details.put("otpValue", otp.getOtpValue());
                        details.put("createdAt", otp.getCreated_at());
                        details.put("expiresAt", otp.getExpires_at());
                        details.put("used", otp.isUsed());
                        details.put("expired", otp.isExpired());
                        return details;
                    })
                    .collect(Collectors.toList());
                
                response.put("otpDetails", otpDetails);
            }
            
            return ResponseEntity.ok(response);
        } catch (UsernameNotFoundException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            authenticationService.createPasswordResetTokenForUser(request.getEmail());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Password reset email has been sent to your email address");
            
            return ResponseEntity.ok(response);
        } catch (UsernameNotFoundException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "If an account with this email exists, a password reset link has been sent");
            
            // Return 200 even if email doesn't exist (security best practice)
            return ResponseEntity.ok(response);
        } catch (MessagingException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to send reset email. Please try again.");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        boolean isValid = authenticationService.validatePasswordResetToken(token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);
        
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        // Validate password and confirm password match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Passwords do not match");
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
        
        boolean result = authenticationService.resetPassword(request.getToken(), request.getPassword());
        
        if (!result) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid or expired token");
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Password has been reset successfully");
        
        return ResponseEntity.ok(response);
    }
    
    // Face ID login endpoint
    @PostMapping("/login-with-face")
    public ResponseEntity<?> loginWithFace(@RequestBody FaceIdLoginRequest request, HttpServletResponse response) {
        try {
            // Find user by email
            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));
            
            // Check if Face ID is enabled for this user
            if (!user.isFaceIdEnabled() || user.getFaceId() == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Face ID not enabled for this user");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            // Verify face with Azure Face API
            FaceIdResponse verificationResult = faceIdServiceImpl.verifyFaceByEmail(
                request.getEmail(), 
                request.getImageBase64()
            );
            
            if (!verificationResult.isSuccess()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", verificationResult.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            // Face verified, generate JWT tokens as done in normal authentication
            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);
            
            // Set the refresh token in an HttpOnly cookie
            addRefreshTokenCookie(response, refreshToken);
            
            // Create user response DTO
            UserResponse userResponse = mapToUserResponse(user);
            
            // Return the auth response without the refresh token in the JSON body
            return ResponseEntity.ok(AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .userResponse(userResponse)
                    .build());
            
        } catch (UsernameNotFoundException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid email");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error during Face ID login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    private void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        // Standard cookie approach
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setMaxAge((int) (refreshExpiration / 1000)); // Convert from ms to seconds
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setSecure(false); // Set to true in production with HTTPS
        response.addCookie(cookie);
        
        // Also set as header for better cross-browser compatibility with explicit SameSite=Lax
        response.addHeader("Set-Cookie", 
            String.format("refresh_token=%s; Path=/; Max-Age=%d; Expires=%s; HttpOnly; SameSite=Lax",
                refreshToken,
                (int) (refreshExpiration / 1000),
                new java.util.Date(System.currentTimeMillis() + refreshExpiration).toGMTString()));
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

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .userUUID(user.getUuid_user())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .image(user.getImage())
                .phone(user.getPhone())
                .address(user.getAddress())
                .birthDate(user.getBirthDate())
                .isActif(user.isActif())
                .Role(user.getRole())
                .faceIdEnabled(user.isFaceIdEnabled())
                .build();
    }
}
