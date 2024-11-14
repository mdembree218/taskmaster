package NCSU.CSC495.microservices.task.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationSettingsDTO {
    private LocalDateTime reminderTime;
    private String notificationType;

}
