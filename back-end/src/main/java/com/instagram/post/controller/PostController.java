package com.instagram.post.controller;

import com.instagram.common.util.JwtUtil;
import com.instagram.post.model.dto.Post;
import com.instagram.post.model.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<String> createPost(@RequestPart MultipartFile postImage,
                                             @RequestPart String postCaption,
                                             @RequestPart String postLocation,
                                             @RequestHeader("Authorization") String authHeader) {
        // 현재 로그인한 사용자 id 가져오기
        /*
        백엔드 인증 기반
        // import org.springframework.security.core.Authentication;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        int currentUserId = Integer.parseInt(authentication.getName());
        */
        String token = authHeader.substring(7); // 맨 앞 "Bearer "만 제거하고 추출
        int currentUserId = jwtUtil.getUserIdFromToken(token); // token 에서 userId 추출
        // post.setUserId(currentUserId);
        boolean success = postService.createPost(postImage, postCaption, postLocation, currentUserId);
        // log 이용하여 token과 currentUserId post 데이터 확인

        if(success){
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public List<Post> getAllPosts(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        int currentUserId = jwtUtil.getUserIdFromToken(token);
        return postService.getAllPosts(currentUserId);
    }
}
