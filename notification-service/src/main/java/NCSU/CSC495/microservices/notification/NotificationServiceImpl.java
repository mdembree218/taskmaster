package NCSU.CSC495.microservices.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final JavaMailSender emailSender;
    private final String fromEmail;

    @Autowired
    public NotificationServiceImpl(JavaMailSender emailSender, 
                                   @Value("${spring.mail.username}") String fromEmail) {
        this.emailSender = emailSender;
        this.fromEmail = fromEmail;
    }

    @Override
    public void sendNotification(ShareTaskDTO task) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(task.getRecipientEmail());
        message.setSubject("Task shared with you");
        message.setText("Task " + task.getTaskInfo());
        emailSender.send(message);
    }
}