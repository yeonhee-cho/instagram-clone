package com.instagram.user.model.service;


import com.instagram.user.model.dto.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {

    void signUp(User user);
    User login(String userEmail, String userPassword);
    User getUserByEmail(String email);
    User getUserById(int userId);
    User updateUser(User user, MultipartFile file);

    // 유저네임으로 유저 조회 메서드
    User getUserByUsername(String userName);

    // 유저 검색 메서드 선언
    // 메서드명: searchUsers, 파라미터: String query, 리턴타입: List<User>
    List<User> searchUsers(String query);
}
