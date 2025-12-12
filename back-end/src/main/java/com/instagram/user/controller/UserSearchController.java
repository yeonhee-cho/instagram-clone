package com.instagram.user.controller;

import com.instagram.user.model.dto.User;
import com.instagram.user.model.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserSearchController {
    private final UserService userService;

    // 유저 검색 API
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam("q") String query) {
        try {
            List<User> user = userService.searchUsers(query);
            log.info("user: {}", user);

            return ResponseEntity.ok(user); // 200 header ~ body

        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.status(500).body(new ArrayList<>());
        }
    }

    // 유저네임으로 조회 API
    @GetMapping("/username/{userName}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String userName) {
        try {
            User u = userService.getUserByUsername(userName);
            log.info("유저네임으로 조회 user: {}", u);

            if(u == null){
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(u);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
