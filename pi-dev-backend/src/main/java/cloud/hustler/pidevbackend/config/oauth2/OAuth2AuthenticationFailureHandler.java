package cloud.hustler.pidevbackend.config.oauth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Value("${app.oauth2.redirectUri:http://localhost:4200/oauth2/redirect}")
    private String defaultRedirectUri;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) 
            throws IOException, ServletException {
        
        log.error("OAuth2 authentication failed", exception);
        
        String redirectUrl = UriComponentsBuilder.fromUriString(defaultRedirectUri)
                .queryParam("error", exception.getMessage())
                .build()
                .toUriString();
        
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}