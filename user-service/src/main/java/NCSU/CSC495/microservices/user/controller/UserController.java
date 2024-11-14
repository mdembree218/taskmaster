package NCSU.CSC495.microservices.user.controller;

import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import NCSU.CSC495.microservices.user.dto.UserDto;
import NCSU.CSC495.microservices.user.exception.InvalidPayloadException;
import NCSU.CSC495.microservices.user.exception.UserIdAlreadyExistException;
import NCSU.CSC495.microservices.user.service.UserService;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> saveUser(@RequestBody UserDto userDto) {
        if (Objects.isNull(userDto)) {
            throw new InvalidPayloadException("Payload cannot be Null");
        }
        if(userService.findByUsername(userDto.getUsername())){
            throw new UserIdAlreadyExistException("Username is already taken");
        }
        return userService.saveUser(userDto);
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserDto> getUser(@PathVariable String username) {
        try {
            return ResponseEntity.ok(userService.getUser(username));
        } catch (final UsernameNotFoundException e) {
            return new ResponseEntity<UserDto>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{username}")
    public ResponseEntity<UserDto> updateUser(@PathVariable String username, @RequestBody UserDto user) {
        try {
            return ResponseEntity.ok(userService.updateUser(username, user));
        } catch (final UsernameNotFoundException e) {
            return new ResponseEntity<UserDto>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<UserDto> deleteUser(@PathVariable String username) {
        try {
            userService.deleteUser(username);
        } catch (final UsernameNotFoundException e) {
            return new ResponseEntity<UserDto>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().build();
    }
}
