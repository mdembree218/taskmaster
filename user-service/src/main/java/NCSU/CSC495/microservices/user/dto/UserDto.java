package NCSU.CSC495.microservices.user.dto;

import lombok.Data;

@Data
public class UserDto {
    private long userId;
    private String username;
    private String email;
    private String password;
    private boolean enableNotifications;
}
