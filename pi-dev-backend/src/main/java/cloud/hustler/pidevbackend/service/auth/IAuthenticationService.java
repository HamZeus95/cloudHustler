package cloud.hustler.pidevbackend.service.auth;

import cloud.hustler.pidevbackend.dto.AuthenticationResponse;
import cloud.hustler.pidevbackend.dto.RegisterRequest;
import cloud.hustler.pidevbackend.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface IAuthenticationService {

    public AuthenticationResponse register(RegisterRequest registerRequest);
    public AuthenticationResponse authenticate(AuthenticationResponse authenticationResponse);
    public void saveUserToken(User user, String jwtToken);
    public void revkeAllUserToken(User user);
    public void refreshToken(HttpServletRequest request, HttpServletResponse response);

}
