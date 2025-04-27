package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.dto.FaceIdResponse;

public interface IFaceIdService {
    /**
     * Registers a user's face for future authentication
     * 
     * @param userId User ID to register face for
     * @param imageBase64 Base64 encoded image of the face
     * @return Response with success/failure status
     */
    FaceIdResponse registerFace(String userId, String imageBase64);
    
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
     * Disables face ID for a user
     * 
     * @param userId User ID to disable face ID for
     * @return Response with success/failure status
     */
    FaceIdResponse disableFaceId(String userId);
}