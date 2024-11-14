package NCSU.CSC495.microservices.notification;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShareTaskDTO {

    private Long taskId;

    private Long recipientId;

    @Email(message = "Invalid email format")
    private String recipientEmail;
    
    private String taskInfo;
}