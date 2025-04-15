package cloud.hustler.pidevbackend.service.auth;

import cloud.hustler.pidevbackend.dto.AuthenticationRequest;
import cloud.hustler.pidevbackend.dto.AuthenticationResponse;
import cloud.hustler.pidevbackend.dto.RegisterRequest;
import cloud.hustler.pidevbackend.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;

public interface IAuthenticationService {

    public AuthenticationResponse register(RegisterRequest registerRequest);
    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest);
    public void revokeAllUserToken(User user);
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException;
    public AuthenticationResponse refreshUserSession(String token, UserDetails userDetails);
    public AuthenticationResponse refreshTokenFromCookie(String refreshToken);
}
