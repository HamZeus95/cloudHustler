package cloud.hustler.pidevbackend.service.auth;

import cloud.hustler.pidevbackend.dto.AuthenticationRequest;
import cloud.hustler.pidevbackend.dto.AuthenticationResponse;
import cloud.hustler.pidevbackend.dto.RegisterRequest;
import cloud.hustler.pidevbackend.dto.UserResponse;
import cloud.hustler.pidevbackend.entity.Consumer;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
public class AuthenticationServiceImplement implements IAuthenticationService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtServiceImplement jwtService;

    @Override
    public AuthenticationResponse register(RegisterRequest registerRequest) {
        // register consumer user
        var user = Consumer
                .builder()
                .email(registerRequest.getEmail())
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .birthDate(registerRequest.getBirthDate())
                .address(registerRequest.getAddress())
                .image(registerRequest.getImage())
                .phone(registerRequest.getPhone())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

            return AuthenticationResponse.builder()
                                         .accessToken(jwtToken)
                                         .refreshToken(refreshToken)
                                         .build();

    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.getEmail(),
                        authenticationRequest.getPassword()
                )
        );
        var user = userRepository.findByEmail(authenticationRequest.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserToken(user);
       var foundUser =  UserResponse.builder()
                                    .address(user.getAddress())
                                    .userUUID(user.getUuid_user())
                                    .image(user.getImage())
                                    .birthDate(user.getBirthDate())
                                    .firstName(user.getFirstName())
                                    .lastName(user.getLastName())
                                    .phone(user.getPhone())
                                    .email(user.getEmail())
                                    .Role(user.getRole())
                                    .isActif(user.isActif())
                                    .build();
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .userResponse(foundUser)
                .build();

    }

    @Override
    public AuthenticationResponse refreshUserSession(String token, UserDetails userDetails) {
        // Extract email from userDetails
        String email = userDetails.getUsername();
        
        // Find the user in the database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found during session validation"));
        
        // Generate new tokens
        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);
        
        // Create user response object
        UserResponse foundUser = UserResponse.builder()
                .address(user.getAddress())
                .userUUID(user.getUuid_user())
                .image(user.getImage())
                .birthDate(user.getBirthDate())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .Role(user.getRole())
                .isActif(user.isActif())
                .build();
                
        // Build and return response
        return AuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .userResponse(foundUser)
                .build();
    }

    @Override
    public void revokeAllUserToken(User user) {
        // revoke all user token
        // todo implement this method
        System.out.printf("Revoking all user token");
    }

    // todo : fix this method
    @Override
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            return;
//        }
//        refreshToken = authHeader.substring(7); // remove Bearer
//        userEmail = jwtService.extractUsername(refreshToken);
//        if (userEmail != null) {
//            var user = this.userRepository.findByEmail(userEmail)
//                    .orElseThrow();
//            if (jwtService.isTokenValid(refreshToken, user)) {
//                var accessToken = jwtService.generateToken(user);
//                revokeAllUserToken(user);
//                var authResponse = AuthenticationResponse.builder()
//                        .accessToken(accessToken)
//                        .refreshToken(refreshToken)
//                        .build();
//                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
//
//
//            }
//        }
        try {
            refreshToken = authHeader.substring(7);
            userEmail = jwtService.extractUsername(refreshToken);

            if (userEmail == null) {
                sendErrorResponse(response, "Invalid refresh token", HttpStatus.UNAUTHORIZED);
                return;
            }

            var user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (!jwtService.isTokenValid(refreshToken, user)) {
                sendErrorResponse(response, "Expired or invalid refresh token", HttpStatus.UNAUTHORIZED);
                return;
            }

            // Generate NEW access and refresh tokens
            var newAccessToken = jwtService.generateToken(user);
            var newRefreshToken = jwtService.generateRefreshToken(user);

            // Revoke the old refresh token (optional: add to a blacklist)
           // revokeOldRefreshToken(refreshToken);

            var authResponse = AuthenticationResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .build();

            response.setStatus(HttpStatus.OK.value());
            new ObjectMapper().writeValue(response.getOutputStream(), authResponse);

        } catch (Exception e) {
            sendErrorResponse(response, "Refresh token failed: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
    
    @Override
    public AuthenticationResponse refreshTokenFromCookie(String refreshToken) {
        // Extract username from the refresh token
        String username = jwtService.extractUsername(refreshToken);
        
        if (username == null) {
            throw new RuntimeException("Invalid refresh token");
        }
        
        // Get user details
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        
        // Validate refresh token
        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new RuntimeException("Refresh token is expired or invalid");
        }
        
        // Generate new tokens
        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);
        
        // Create user response
        UserResponse userResponse = UserResponse.builder()
                .address(user.getAddress())
                .userUUID(user.getUuid_user())
                .image(user.getImage())
                .birthDate(user.getBirthDate())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .Role(user.getRole())
                .isActif(user.isActif())
                .build();
        
        // Return authentication response with new tokens
        return AuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .userResponse(userResponse)
                .build();
    }

    private void sendErrorResponse(HttpServletResponse response, String message, HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getOutputStream(), Map.of(
                "error", status.getReasonPhrase(),
                "message", message
        ));
    }
}
