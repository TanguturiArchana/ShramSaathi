package com.osi.shramsaathi.controller;

import com.osi.shramsaathi.dto.OwnerResponse;
import com.osi.shramsaathi.dto.UserRequest;
import com.osi.shramsaathi.dto.UserResponse;
import com.osi.shramsaathi.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.osi.shramsaathi.model.User;
import java.util.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

  
    @PostMapping
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRequest request) {
        UserResponse response = userService.register(request);
        return ResponseEntity.ok(response);
    }

   
    @GetMapping
    public ResponseEntity<List<UserResponse>> all() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<UserResponse>> allForOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(userService.getAllUsersForOwner(ownerId));
    }

     @PutMapping("/update-field/{id}")
    public User updateField(
            @PathVariable Long id,
            @RequestParam String field,
            @RequestParam String value
    ) {
        return userService.updateField(id, field, value);
    }

    @GetMapping("/findByNameAndPassword")
    public ResponseEntity<UserResponse> findByNameAndPassword(@RequestParam String name,@RequestParam String password) {
        return ResponseEntity.ok(userService.findByNameAndPassword(name, password));
    }

    @GetMapping("/findWorker")
    public ResponseEntity<UserResponse> findWorker(@RequestParam String name,@RequestParam String phone) {
        return ResponseEntity.ok(userService.findByNameAndPhone(name, phone));
    }
     @GetMapping("/profile/{id}")
    public ResponseEntity<?> getWorkerProfile(@PathVariable Long id) {
        try {
            UserResponse response = userService.getUserById(id);
            
            return ResponseEntity.ok(response);
        } 
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Worker not found"+id);
        }
    }
    @PutMapping("/change-password/{id}")
    public ResponseEntity<String> changePassword(@PathVariable Long id,@RequestBody Map<String, String> req) {
        String oldPassword = req.get("oldPassword");
        String newPassword = req.get("newPassword");
        String result = userService.changePassword(id, oldPassword, newPassword);
        if (result.equals("Old password is incorrect")) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
}
