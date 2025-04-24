package cloud.hustler.pidevbackend.config.oauth2;

import cloud.hustler.pidevbackend.dto.AuthenticationResponse;
import cloud.hustler.pidevbackend.dto.UserResponse;
import cloud.hustler.pidevbackend.entity.Consumer;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.UserRepository;
import cloud.hustler.pidevbackend.service.auth.JwtServiceImplement;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtServiceImplement jwtService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    @Value("${app.oauth2.redirectUri:http://localhost:4200/oauth2/redirect}")
    private String defaultRedirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {

        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2User oAuth2User = ((OAuth2AuthenticationToken) authentication).getPrincipal();

            String email;
            String provider = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();

            if ("google".equals(provider)) {
                email = oAuth2User.getAttribute("email");
            } else if ("github".equals(provider)) {
                // GitHub might not expose email directly
                email = extractEmailFromGitHub(oAuth2User);
            } else {
                throw new IllegalArgumentException("Unsupported OAuth2 provider: " + provider);
            }

            if (email == null) {
                throw new IllegalArgumentException("Email not available from OAuth2 provider");
            }

            // Try to find existing user or create a new one
            User user = processUserRegistration(email, oAuth2User, provider);

            // Generate JWT tokens
            String jwtToken = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            // Create user response object
            UserResponse userResponse = UserResponse.builder()
                    .userUUID(user.getU())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .image(user.getImage())
                    .birthDate(user.getBirthDate())
                    .address(user.getAddress())
                    .Role(user.getRole())
                    .isActif(user.isActif())
                    .build();

            AuthenticationResponse authResponse = AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .userResponse(userResponse)
                    .build();

            // Add refresh token as a cookie
            addRefreshTokenCookie(response, refreshToken);

            // Build redirect URL with the token
            String redirectUrl = buildRedirectUrl(jwtToken, userResponse);

            // Clear authentication attributes
            clearAuthenticationAttributes(request);

            // Redirect to frontend with the token
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        }
    }

    private String extractEmailFromGitHub(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");

        if (email == null) {
            // For GitHub, sometimes email is private
            Map<String, Object> attributes = oAuth2User.getAttributes();
            log.info("GitHub attributes: {}", attributes);

            // Try to get primary email from emails array if available
            if (attributes.containsKey("emails")) {
                Object emails = attributes.get("emails");
                // Process emails array based on GitHub's API response structure
                if (emails instanceof Iterable) {
                    for (Object emailObj : (Iterable<?>) emails) {
                        if (emailObj instanceof Map) {
                            Map<?, ?> emailMap = (Map<?, ?>) emailObj;
                            if (Boolean.TRUE.equals(emailMap.get("primary"))) {
                                email = (String) emailMap.get("email");
                                break;
                            }
                        }
                    }
                }
            }

            // If still no email, create a placeholder with the login
            if (email == null && attributes.containsKey("login")) {
                String login = (String) attributes.get("login");
                email = login + "@github.user";
            }
        }

        return email;
    }

    private User processUserRegistration(String email, OAuth2User oAuth2User, String provider) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            // Update any necessary fields from the OAuth2 profile
            updateUserFromOAuth2(existingUser, oAuth2User, provider);
            return userRepository.save(existingUser);
        } else {
            // Create a new user
            User user = createUserFromOAuth2(email, oAuth2User, provider);
            return userRepository.save(user);
        }
    }

    private User createUserFromOAuth2(String email, OAuth2User oAuth2User, String provider) {
        String firstName = null;
        String lastName = null;
        String pictureUrl = null;

        if ("google".equals(provider)) {
            firstName = oAuth2User.getAttribute("given_name");
            lastName = oAuth2User.getAttribute("family_name");
            pictureUrl = oAuth2User.getAttribute("picture");
        } else if ("github".equals(provider)) {
            String name = oAuth2User.getAttribute("name");
            if (name != null) {
                String[] names = name.split(" ", 2);
                firstName = names[0];
                lastName = names.length > 1 ? names[1] : "";
            }
            pictureUrl = oAuth2User.getAttribute("avatar_url");
        }

        return Consumer.builder()
                .firstName(firstName != null ? firstName : "User")
                .lastName(lastName != null ? lastName : "")
                .email(email)
                .image(pictureUrl)
                .provider(provider)
                .providerId(oAuth2User.getName())
                .isActif(true)
                .build();
    }

    private void updateUserFromOAuth2(User user, OAuth2User oAuth2User, String provider) {
        user.setProvider(provider);
        user.setProviderId(oAuth2User.getName());

        // Update other fields if needed
        if ("google".equals(provider)) {
            if (user.getImage() == null || user.getImage().isEmpty()) {
                String picture = oAuth2User.getAttribute("picture");
                if (picture != null) {
                    user.setImage(picture);
                }
            }
        } else if ("github".equals(provider)) {
            if (user.getImage() == null || user.getImage().isEmpty()) {
                String avatarUrl = oAuth2User.getAttribute("avatar_url");
                if (avatarUrl != null) {
                    user.setImage(avatarUrl);
                }
            }
        }
    }

    private String buildRedirectUrl(String token, UserResponse userResponse) {
        try {
            String userJson = objectMapper.writeValueAsString(userResponse);
            return UriComponentsBuilder.fromUriString(defaultRedirectUri)
                    .queryParam("token", token)
                    .queryParam("user", userJson)
                    .build()
                    .toUriString();
        } catch (Exception e) {
            log.error("Failed to serialize user data", e);
            return UriComponentsBuilder.fromUriString(defaultRedirectUri)
                    .queryParam("token", token)
                    .build()
                    .toUriString();
        }
    }

    private void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        int maxAge = (int) (refreshExpiration / 1000); // Convert milliseconds to seconds

        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/"); // or set to specific path like "/api/v1/auth"
        cookie.setSecure(false); // Set to true in production with HTTPS
        cookie.setMaxAge(maxAge);

        response.addCookie(cookie);
    }
}