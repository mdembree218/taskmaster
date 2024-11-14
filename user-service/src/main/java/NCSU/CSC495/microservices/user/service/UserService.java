package NCSU.CSC495.microservices.user.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import NCSU.CSC495.microservices.user.dto.UserDto;
import NCSU.CSC495.microservices.user.model.User;
import NCSU.CSC495.microservices.user.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<UserDto> saveUser(UserDto dto) {
        User entity = new User();
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        BeanUtils.copyProperties(dto, entity);
        User savedUser = userRepository.save(entity);
        dto.setPassword("******");
        dto.setUserId(savedUser.getUserId());
        return ResponseEntity.ok(dto);
    }

    public boolean findByUsername(String username) {
        Optional<User> byUsername = userRepository.findByUsername(username);
        if (byUsername.isPresent()) {
            return true;
        }
        return false;
    }

    public UserDto getUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        UserDto dto = new UserDto();
        BeanUtils.copyProperties(user, dto);
        return dto;
    }

    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDtos = new ArrayList<>();
        users.forEach(user -> {
            UserDto dto = new UserDto();
            BeanUtils.copyProperties(user, dto);
            dto.setPassword("******");
            userDtos.add(dto);
        });
        return userDtos;
    }

    public UserDto updateUser(String username, UserDto dto) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        BeanUtils.copyProperties(dto, user);
        User savedUser = userRepository.save(user);
        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(savedUser, userDto);
        return userDto;
    }

    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}
