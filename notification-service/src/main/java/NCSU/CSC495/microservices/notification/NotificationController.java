package NCSU.CSC495.microservices.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/share")
    public ResponseEntity<String> sendNotification(@RequestBody ShareTaskDTO shareTaskDTO) {
        try {
            notificationService.sendNotification(shareTaskDTO);
            return ResponseEntity.ok("Task shared successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sharing task: " + e.getMessage());
        }
    }
}