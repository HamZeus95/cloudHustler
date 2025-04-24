package cloud.hustler.pidevbackend.service.auth;

import cloud.hustler.pidevbackend.dto.AuthenticationRequest;
import cloud.hustler.pidevbackend.dto.AuthenticationResponse;
import cloud.hustler.pidevbackend.dto.RegisterRequest;
import cloud.hustler.pidevbackend.dto.UserResponse;
import cloud.hustler.pidevbackend.entity.*;
import cloud.hustler.pidevbackend.exception.UserAlreadyExistsException;
import cloud.hustler.pidevbackend.repository.OtpRepository;
import cloud.hustler.pidevbackend.repository.PasswordResetTokenRepository;
import cloud.hustler.pidevbackend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
    @Autowired
    private JavaMailSenderImpl mailSender;
    @Autowired
    private OtpRepository otpRepository;
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Override
    public AuthenticationResponse register(RegisterRequest registerRequest) {
        // check if user already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered. Please use a different email address or login to your existing account.");
        }
        // if registerRequest has getYearsOfExperience then build and expert else build a consumer
        // check if user is a consumer or an expert
        // Create either an user based on presence of speciality type
        User user = createUser(registerRequest);
        
        // Make sure the user is not active until OTP verification
        user.setActif(false);

        // Save user and generate tokens
        var savedUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        System.out.printf("User registered with email: %s\n", user);
        
        // Generate and send OTP
        try {
            Otp otp = generateOtp(savedUser);
            sendOtpEmail(savedUser, otp.getOtpValue());
        } catch (MessagingException e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
            // Continue with registration process even if email fails
        }

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken) 
                .userResponse(UserResponse.builder()
                        .address(savedUser.getAddress())
                        .userUUID(savedUser.getUserId())
                        .image(savedUser.getImage())
                        .birthDate(savedUser.getBirthDate())
                        .firstName(savedUser.getFirstName())
                        .lastName(savedUser.getLastName())
                        .phone(savedUser.getPhone())
                        .email(savedUser.getEmail())
                        .Role(savedUser.getRole())
                        .isActif(savedUser.isActif())
                        .build())
                .build();

    }
    private User createUser(RegisterRequest request) {

        System.out.printf("Creating user with email: %s\n", request);
        // Common user properties builder
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // Create Expert or Consumer based on speciality type
        if (request.getRole() != null && request.getRole().equals("expert")) {
            return Expert.builder()
                    .email(request.getEmail())
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .birthDate(request.getBirthDate())
                    .address(request.getAddress())
                    .image(request.getImage())
                    .phone(request.getPhone())
                    .password(encodedPassword)
                    .yearsOfExperience(request.getYearsOfExperience())
                    .typeSpeciality(request.getTypeSpeciality())
                    .build();
        } else if (request.getRole() != null && request.getRole().equals("farmer")) {

            return Farmer.builder()
                    .email(request.getEmail())
                    .lastName(request.getLastName())
                    .birthDate(request.getBirthDate())
                    .address(request.getAddress())
                    .image(request.getImage())
                    .phone(request.getPhone())
                    .password(encodedPassword)
                    .experience(request.getExperience())
                    .build();
        }
        else if (request.getRole() != null && request.getRole().equals("delivery")) {
            return DeliveryDriver.builder()
                    .email(request.getEmail())
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .birthDate(request.getBirthDate())
                    .address(request.getAddress())
                    .image(request.getImage())
                    .phone(request.getPhone())
                    .password(encodedPassword)
                    .isAvailable(request.isAvailable()) // Using isAvailable() getter that matches our renamed field
                    .build();
        }

            return Consumer.builder()
                    .email(request.getEmail())
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .birthDate(request.getBirthDate())
                    .address(request.getAddress())
                    .image(request.getImage())
                    .phone(request.getPhone())
                    .password(encodedPassword)
                    .build();

    }
   
    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        // Try to authenticate with the provided credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.getEmail(),
                        authenticationRequest.getPassword()
                )
        );
        
        // Find the user
        var user = userRepository.findByEmail(authenticationRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + authenticationRequest.getEmail()));
        
        // Check if user account is active
        if (!user.isActif()) {
            throw new RuntimeException("Account not verified. Please verify your email address before logging in.");
        }
        
        // Generate tokens
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        
        // Revoke any existing tokens
        revokeAllUserToken(user);
        
        // Create user response object
        var foundUser = UserResponse.builder()
                .address(user.getAddress())
                .userUUID(user.getUserId())
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
                .userUUID(user.getUserId())
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
                .userUUID(user.getUserId())
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

    @Override
    public void sendVerificationEmail(String emailTo, String subject, String htmlContent) throws MessagingException {
        try {
            System.out.println("Attempting to send email to: " + emailTo);
            System.out.println("Using mail server: " + mailSender.getHost() + ":" + mailSender.getPort());
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(emailTo);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // Set HTML content
            helper.setFrom(mailSender.getUsername()); // Explicitly set sender

            mailSender.send(message);
            System.out.println("Email sent successfully to: " + emailTo);
        } catch (Exception e) {
            System.err.println("Failed to send email to: " + emailTo);
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to be handled by caller
        }
    }

    private void sendErrorResponse(HttpServletResponse response, String message, HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getOutputStream(), Map.of(
                "error", status.getReasonPhrase(),
                "message", message
        ));
    }
    
    // OTP implementation methods
    @Override
    public Otp generateOtp(User user) {
        // Generate a random 6-digit OTP
        Random random = new Random();
        String otpValue = String.format("%06d", random.nextInt(1000000));
        
        // Create OTP object with 15 minutes expiration
        Otp otp = new Otp(user, otpValue, 15);
        
        // Save to database
        return otpRepository.save(otp);
    }
    
    @Override
    public boolean verifyOtp(String otpValue, String email) {
        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        // Find OTP by value and user
        return otpRepository.findByOtpValueAndUserAndUsedFalse(otpValue, user)
                .map(otp -> {
                    // Check if OTP is expired
                    if (otp.isExpired()) {
                        return false;
                    }
                    
                    // Mark OTP as used
                    otp.markAsUsed();
                    otpRepository.save(otp);
                    
                    // Activate user
                    user.setActif(true);
                    userRepository.save(user);
                    
                    return true;
                })
                .orElse(false);
    }
    
    @Override
    public void sendOtpEmail(User user, String otpValue) throws MessagingException {
        String subject = "Account Verification OTP";
        String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>"
                + "<h2 style='color: #4CAF50;'>Account Verification</h2>"
                + "<p>Hello " + user.getFirstName() + ",</p>"
                + "<p>Thank you for registering with us. To verify your account, please use the following OTP (One Time Password):</p>"
                + "<div style='background-color: #f2f2f2; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;'>" 
                + otpValue 
                + "</div>"
                + "<p>This OTP is valid for 15 minutes.</p>"
                + "<p>If you did not request this verification, please ignore this email.</p>"
                + "<p>Best regards,<br>The Team</p>"
                + "</div>";
        
        sendVerificationEmail(user.getEmail(), subject, htmlContent);
    }

    // Password reset implementation methods
    @Override
    public PasswordResetToken createPasswordResetTokenForUser(String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Invalidate any existing tokens for this user
        List<PasswordResetToken> existingTokens = passwordResetTokenRepository.findByUser(user);
        existingTokens.forEach(token -> {
            token.setUsed(true);
            passwordResetTokenRepository.save(token);
        });

        // Create new token
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .createdAt(LocalDateTime.now())
                .expiryDate(LocalDateTime.now().plusHours(1)) // Token expires in 1 hour
                .used(false)
                .build();

        PasswordResetToken savedToken = passwordResetTokenRepository.save(resetToken);
        
        // Send email with reset link
        sendPasswordResetEmail(user, savedToken.getToken());
        
        return savedToken;
    }

    @Override
    public boolean validatePasswordResetToken(String token) {
        Optional<PasswordResetToken> resetTokenOpt = passwordResetTokenRepository.findByTokenAndUsed(token, false);

        if (resetTokenOpt.isEmpty()) {
            return false; // Token not found or already used
        }

        PasswordResetToken resetToken = resetTokenOpt.get();
        
        // Check if token is expired
        if (resetToken.isExpired()) {
            return false;
        }

        return true;
    }

    @Override
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> resetTokenOpt = passwordResetTokenRepository.findByTokenAndUsed(token, false);

        if (resetTokenOpt.isEmpty()) {
            return false; // Token not found or already used
        }

        PasswordResetToken resetToken = resetTokenOpt.get();
        
        // Check if token is expired
        if (resetToken.isExpired()) {
            return false;
        }

        // Update password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        return true;
    }

    @Override
    public void sendPasswordResetEmail(User user, String token) throws MessagingException {
        String resetUrl = "http://localhost:4200/frontoffice/reset-password?token=" + token;
        String subject = "Password Reset Request";
        String htmlContent = 
            "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>" +
            "<h2 style='color: #333; text-align: center;'>Password Reset Request</h2>" +
            "<p style='font-size: 16px; line-height: 1.5; color: #555;'>Hello " + user.getFirstName() + ",</p>" +
            "<p style='font-size: 16px; line-height: 1.5; color: #555;'>We received a request to reset your password. Click the button below to create a new password:</p>" +
            "<div style='text-align: center; margin: 30px 0;'>" +
            "<a href='" + resetUrl + "' style='display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Reset Password</a>" +
            "</div>" +
            "<p style='font-size: 16px; line-height: 1.5; color: #555;'>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>" +
            "<p style='font-size: 16px; line-height: 1.5; color: #555;'>This link will expire in 1 hour for security reasons.</p>" +
            "<p style='font-size: 16px; line-height: 1.5; color: #555; margin-top: 30px;'>Best regards,<br>The Support Team</p>" +
            "</div>";

        sendVerificationEmail(user.getEmail(), subject, htmlContent);
    }
}