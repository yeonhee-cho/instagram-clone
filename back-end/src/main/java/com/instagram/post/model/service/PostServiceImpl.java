package com.instagram.post.model.service;

import com.instagram.common.util.FileUploadService;
import com.instagram.post.model.dto.Post;
import com.instagram.post.model.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    // alt + enter 메서드 구현
    private final PostMapper postMapper;
    private final FileUploadService fileUploadService;

    /**
     * 전체 게시글 조회
     */
    @Override
    public List<Post> getAllPosts(int currentUserId) {
        return postMapper.selectAllPosts(currentUserId);
    }

    /**
     * 게시글 상세 조회
     */
    @Override
    public Post getPostsById(int postId, int currentUserId) {
        return postMapper.selectPostById(postId, currentUserId);
    }

    /**
     * 특정 사용자의 게시글 목록 조회
     */
    @Override
    public List<Post> getPostsByUserId(int userId) {
        return postMapper.selectPostsByUserId(userId);
    }

    /**
     * 게시글 생성
     */
    @Override
    public boolean createPost(MultipartFile postImage,
                              String postCaption,
                              String postLocation,
                              int currentUserId) {
        // 게시물이 하나라도 등록되면 true 0 이하는 false
        // 파일 업로드 서비스 이용해서 게시물 이미지 데이터 저장
        try {
            String imageUrl = fileUploadService.uploadPostImage(postImage);

            // 객체 생성 및 데이터 세팅
            Post post = new Post();
            post.setUserId(currentUserId);
            post.setPostCaption(postCaption); 
            post.setPostLocation(postLocation);
            post.setPostImage(imageUrl); // 업로드 된 이미지 url

            return postMapper.insertPost(post) > 0; // insert 실행 후 성공 시 1 이상 반환
            
        } catch (Exception e){
            log.error("❌ 게시물 작성 실패 : ", e);
            return false;
        }

    }

    /**
     * 게시글 삭제
     */
    @Override
    public boolean deletePost(int postId) {
        return postMapper.deletePost(postId) > 0;
    }


    /**
     * 좋아요 추가
     */
    @Override
    public boolean addLike(int postId, int userId) {
        return postMapper.insertLike(postId, userId) > 0;
    }

    /**
     * 좋아요 취소
     */
    @Override
    public boolean removeLike(int postId, int userId) {
        return postMapper.deleteLike(postId, userId) > 0;
    }
}
