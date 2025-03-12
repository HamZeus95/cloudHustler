package cloud.hustler.pidevbackend.service.auth;

import cloud.hustler.pidevbackend.dto.AuthenticationResponse;
import cloud.hustler.pidevbackend.dto.RegisterRequest;
import cloud.hustler.pidevbackend.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AuthenticationServiceImplement implements IAuthenticationService {
    @Override
    public AuthenticationResponse register(RegisterRequest registerRequest) {
        return null;
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationResponse authenticationResponse) {
        return null;
    }

    @Override
    public void saveUserToken(User user, String jwtToken) {

    }

    @Override
    public void revkeAllUserToken(User user) {

    }

    @Override
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) {

    }
}
