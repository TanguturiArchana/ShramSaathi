
package com.osi.shramsaathi.service;

import com.osi.shramsaathi.dto.UserRequest;
import com.osi.shramsaathi.dto.UserResponse;
import com.osi.shramsaathi.model.User;
import java.util.List;

public interface UserService {

    UserResponse register(UserRequest request);

    List<UserResponse> getAllUsers();
    List<UserResponse> getAllUsersForOwner(Long ownerId);
    UserResponse findByNameAndPhone(String name, String phone);
    UserResponse findByNameAndPassword(String name, String password);
    User updateField(Long id, String field, String value);
    String changePassword(Long id, String oldPassword, String newPassword);

;

    UserResponse getUserById(Long id);
}
