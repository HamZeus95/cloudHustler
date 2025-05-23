package cloud.hustler.pidevbackend.config;

import cloud.hustler.pidevbackend.config.oauth2.OAuth2AuthenticationFailureHandler;
import cloud.hustler.pidevbackend.config.oauth2.OAuth2AuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.filter.CorsFilter;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;

import static org.springframework.http.HttpMethod.*;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {
    // Note: The application has a context path of /api/v1, so these paths are relative to that
    private static final String[] WHITE_LIST_URL = {
            "/auth/**",
            "/oauth2/**",
            "/farm/**",  // Add OAuth2 endpoints to whitelist
            "/face-id/login-with-face-only", // Add Face ID endpoints to whitelist
            "/v2/api-docs",
            "/v3/api-docs",
            "/reactions/**",
            "/**",
            "/users/**", // temporary
            "/v3/api-docs/**",
            "/posts/**", // temporary
            "/Event/getEvents", // temporary
            "Event/**", // fix later
            "/product/**",
            "/cart/**",
            "/productcategory/**",
            "/payment/**",
//            "/livraisons/**",
//            "/factures/**",
            "/orders/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/farms/**",
            "/ia-farm/**",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html",
            "/error",  // Added error path to allow access to error pages
            "/uploads/**", // Allow access to uploaded files
            "/static/**", // Allow access to static resources
            "/images/**" ,
            "/services/**",
            "/files/**",
            "/service-requests/**",
            "/quiz/**",// Allow access to image resources
            "/**"
    };
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;
    private final CorsFilter corsFilter;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> {}) // Enable CORS
                .authorizeHttpRequests(req ->
                        req.requestMatchers(WHITE_LIST_URL)
                                .permitAll()
                                .anyRequest()
                                .authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout ->
                        logout.logoutUrl("/auth/logout")  // context path is already /api/v1
                                .addLogoutHandler(logoutHandler)
                                .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
                )
                // Configure OAuth2 login
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(endpoint -> endpoint
                                .baseUri("/oauth2/authorize"))
                        .redirectionEndpoint(endpoint -> endpoint
                                .baseUri("/oauth2/callback/*"))
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService()))
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                        .failureHandler(oAuth2AuthenticationFailureHandler)
                );

        return http.build();
    }
    
    @Bean
    public CustomOAuth2UserService customOAuth2UserService() {
        return new CustomOAuth2UserService();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        // Create a signing key from the secret
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        Key signingKey = new SecretKeySpec(keyBytes, "HmacSHA256");

        // Return a JWT decoder that uses this key
        return NimbusJwtDecoder.withSecretKey((javax.crypto.SecretKey) signingKey).build();
    }
}
