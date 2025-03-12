package cloud.hustler.pidevbackend.service.user;

import cloud.hustler.pidevbackend.dto.ChangePasswordRequest;

import java.security.Principal;

public interface IUserService {
    void changePasssword(ChangePasswordRequest request, Principal connectedUser);

}
