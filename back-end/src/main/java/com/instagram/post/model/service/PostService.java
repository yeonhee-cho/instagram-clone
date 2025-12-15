package com.instagram.post.model.service;

import com.instagram.post.model.dto.Post;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PostService {
    // 모든 게시물 조회(= 로그인했을 때 내가 팔로워하는 지인 기준)
    // 새로운 게시물들 팔로우 안 한 유저 게시물 사용 가능
    List<Post> getAllPosts(int currentUserId);

    // 나의 피드나 특정 유저의 피드로 접속했을 때 유저가 올린 게시물들 조회
    Post getPostsById(int postId, int currentUserId);

    // 나의 피드나 특정 유저의 피드로 접속했을 때 특정 피드를 선택하여 피드 세부사항 조회
    boolean createPost(MultipartFile postImage,
                       String postCaption,
                       String postLocation,
                       int currentUserId);

    //
    boolean deletePost(int postId);

    List<Post> getPostsByUserId(int userId);

    boolean addLike(int postId, int userId);

    boolean removeLike(int postId, int userId);
}
