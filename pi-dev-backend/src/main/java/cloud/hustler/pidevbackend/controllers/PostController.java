package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Post;
import cloud.hustler.pidevbackend.entity.User;
import cloud.hustler.pidevbackend.repository.UserRepository;
import cloud.hustler.pidevbackend.service.EmailService;
import cloud.hustler.pidevbackend.service.IPostService;
import cloud.hustler.pidevbackend.service.SmsService;
import cloud.hustler.pidevbackend.service.user.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.nio.file.Files;
import org.springframework.http.HttpStatus;

import java.util.UUID;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.util.List;


@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private IPostService postService;
    @Autowired
    private UserRepository userService;

    @Autowired
    private EmailService emailService;
    @Autowired
    private SmsService smsService;

    public static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/addPost")
    public ResponseEntity<Post> addPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "media", required = false) MultipartFile media,
            @RequestParam(value = "createdAt", required = false) String createdAt,
            @RequestParam(value = "updatedAt", required = false) String updatedAt,
            @RequestParam("userUuid") UUID userUuid) {

        try {
            // Rechercher l'utilisateur
            User user = userService.findByUuid_user(userUuid)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec UUID: " + userUuid));

            String mediaUrl = null;
            if (media != null && !media.isEmpty()) {
                try {
                    String filename = UUID.randomUUID() + "_" + StringUtils.cleanPath(media.getOriginalFilename());
                    Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
                    Files.createDirectories(uploadPath);
                    Path filePath = uploadPath.resolve(filename);
                    Files.copy(media.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    mediaUrl = "/pi-dev-backend/uploads/" + filename;
                } catch (IOException ex) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(null);
                }
            }

            Date createdDate = createdAt != null ? parseDate(createdAt) : new Date();
            Date updatedDate = updatedAt != null ? parseDate(updatedAt) : new Date();

            Post post = new Post();
            post.setTitle(title);
            post.setContent(content);
            post.setMediaUrl(mediaUrl);
            post.setCreatedAt(createdDate);
            post.setUpdatedAt(updatedDate);
            post.setUser(user); // Associer l'utilisateur

            Post savedPost = postService.addPost(post);

            // Envoi de l'email après création réussie du post
            try {
                emailService.sendPostNotification("mohamed242001taher@gmail.com", savedPost);
            } catch (Exception e) {
                System.err.println("Erreur lors de l'envoi de l'email: " + e.getMessage());
                // Ne pas interrompre le flux même si l'email échoue
            }


//            try {
//                // SMS
//                String smsContent = String.format(
//                        "Nouveau post créé:\nTitre: %s\n%s",
//                        savedPost.getTitle(),
//                        content.length() > 100 ? content.substring(0, 100) + "..." : content
//                );
//
//                smsService.sendSms("+21694790194", smsContent); // Numéro tunisien format E.164
//
//            } catch (Exception e) {
//                System.err.println("Erreur notification: " + e.getMessage());
//                // Continuer même si l'envoi échoue
//            }

            return ResponseEntity.ok(savedPost);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }

    // ... (le reste de vos méthodes existantes reste inchangé)
    @PutMapping("/updatePostById/{postId}")
    public ResponseEntity<Post> updatePostById(@PathVariable UUID postId, @RequestBody Post postUpdates) {
        try {
            Post updatedPost = postService.updatePostById(postId, postUpdates);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/deletePost/{postId}")
    public ResponseEntity<Void> deletePostByIdWithCommentAndReaction(@PathVariable UUID postId) {
        postService.deletePostByIdWithCommentAndReaction(postId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getAllPost")
    public List<Post> getAllPost() {
        return postService.getAllPosts();
    }

    @GetMapping("/getPostById/{postId}")
    public Post getPostById(@PathVariable UUID postId) {
        return postService.getPostById(postId);
    }

    private Date parseDate(String dateString) throws ParseException {
        return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").parse(dateString);
    }

    private Date parseDate(String dateString, Date defaultDate) {
        if (dateString == null) return defaultDate;
        try {
            return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").parse(dateString);
        } catch (ParseException e) {
            return defaultDate;
        }
    }
}