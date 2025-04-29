package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.dto.FaceIdResponse;
import cloud.hustler.pidevbackend.entity.User;

import java.security.Principal;
import java.util.Optional;

public interface IFaceIdService {
    /**
     * Registers a user's face for future authentication using Principal
     * 
     * @param principal The authenticated user's Principal
     * @param imageBase64 Base64 encoded image of the face
     * @return Response with success/failure status
     */
    FaceIdResponse registerFace(Principal principal, String imageBase64);

    /**
     * Registers a user's face for future authentication
     * 
     * @param userId User ID to register face for
     * @param imageBase64 Base64 encoded image of the face
     * @return Response with success/failure status
     */
    FaceIdResponse registerFace(String userId, String imageBase64);
    
    /**
     * Verifies a face against the authenticated user
     * 
     * @param principal The authenticated user's Principal
     * @param imageBase64 Base64 encoded image of the face to verify
     * @return Response with verification status
     */
    FaceIdResponse verifyFace(Principal principal, String imageBase64);

    /**
     * Verifies a face against a registered user
     * 
     * @param userId User ID to verify against
     * @param imageBase64 Base64 encoded image of the face to verify
     * @return Response with verification status
     */
    FaceIdResponse verifyFace(String userId, String imageBase64);
    
    /**
     * Verifies a face using email as identifier
     * 
     * @param email User's email
     * @param imageBase64 Base64 encoded image of the face to verify
     * @return Response with verification status
     */
    FaceIdResponse verifyFaceByEmail(String email, String imageBase64);
    
    /**
     * Attempts to identify a user using only their face image
     * This method is used for face-only login without requiring email
     * 
     * @param imageBase64 Base64 encoded image of the face to identify
     * @return Optional User if identified, empty if no match found
     */
    Optional<User> identifyUserByFaceOnly(String imageBase64);
    
    /**
     * Disables face ID for the authenticated user
     * 
     * @param principal The authenticated user's Principal
     * @return Response with success/failure status
     */
    FaceIdResponse disableFaceId(Principal principal);

    /**
     * Disables face ID for a user
     * 
     * @param userId User ID to disable face ID for
     * @return Response with success/failure status
     */
    FaceIdResponse disableFaceId(String userId);
}