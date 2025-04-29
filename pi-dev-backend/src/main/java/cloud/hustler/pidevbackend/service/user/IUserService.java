package cloud.hustler.pidevbackend.service.user;

import cloud.hustler.pidevbackend.dto.ChangePasswordRequest;
import cloud.hustler.pidevbackend.dto.UserResponse;
import cloud.hustler.pidevbackend.dto.UserUpdateRequest;
import cloud.hustler.pidevbackend.dto.UserNotConsumerDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface IUserService {
    void changePasssword(ChangePasswordRequest request, Principal connectedUser);
    UserResponse updateProfile(UserUpdateRequest updateRequest, Principal connectedUser) throws IOException;
    UserResponse getUserById(UUID userId);
    String saveUserImage(MultipartFile file) throws IOException;
    List<UserNotConsumerDTO> getAllUsersNotConsumer(String query);
}
