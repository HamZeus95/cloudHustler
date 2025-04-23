package cloud.hustler.pidevbackend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Slf4j
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);
        
        try {
            return processOAuth2User(userRequest, user);
        } catch (Exception ex) {
            log.error("Exception while processing OAuth2 user", ex);
            throw ex;
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        // Extract provider details
        String provider = oAuth2UserRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        
        log.info("Processing OAuth2 user from provider: {}", provider);
        
        String nameAttributeKey;
        if ("google".equals(provider)) {
            nameAttributeKey = "sub"; // Google uses "sub" as the unique identifier
        } else if ("github".equals(provider)) {
            nameAttributeKey = "id"; // GitHub uses "id" as the unique identifier
        } else {
            nameAttributeKey = oAuth2UserRequest.getClientRegistration()
                    .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
        }
        
        // We'll process this user in the OAuth2AuthenticationSuccessHandler
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                nameAttributeKey
        );
    }
}