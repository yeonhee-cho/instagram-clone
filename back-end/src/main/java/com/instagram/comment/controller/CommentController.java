package com.instagram.comment.controller;

import com.instagram.comment.model.dto.Comment;
import com.instagram.comment.model.dto.CommentResponse;
import com.instagram.comment.model.service.CommentService;
import com.instagram.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final JwtUtil jwtUtil;

    /**
     * 특정 게시물 조회(댓글목록 + 개수)
     *  GET/api/posts/{postId}/comments
     *  getComments
     */
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> getCommentsByPostId(@PathVariable("postId") int postId) {
        // log.info("📌 특정 게시물 조회 진입 : {}", postId);
        try {
            // 댓글들 배열과 댓글 개수 들어있다.
            CommentResponse comments = commentService.getCommentsByPostId(postId);
            // log.info("📌 comments:{}", comments);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            log.error("댓글 조회 실패 : {}",e.getMessage());
            return  ResponseEntity.badRequest().build();
        }
    }

    /**
     * 댓글작성
     * POST /api/posts/{postId}/comments
     * createComment
     */
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<Boolean> createComment(@PathVariable("postId") int postId,
                                                 @RequestHeader("Authorization") String authHeader,
                                                 @RequestBody Comment comment) {
        try {
            // log.info("📌 진입 성공");
            String token = authHeader.substring(7);
            int currentUserId = jwtUtil.getUserIdFromToken(token);
            comment.setUserId(currentUserId);

            // log.info("📌 comment: {}", comment);
            boolean r =  commentService.createComment(postId,currentUserId,comment.getCommentContent());
            // log.info("📌 r : {}", r);
            return ResponseEntity.ok(r);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("댓글 작성 실패 : {}",e.getMessage());
            return ResponseEntity.badRequest().body(false);
        }
    }

    /**
     * 댓글삭제
     * DELETE /api/comments/{commentId}
     * deleteComment
     */
    // TODO 내 댓글만 삭제
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable("commentId") int commentId,
                                              @RequestHeader("Authorization") String authHeader) {
        log.info("📌 삭제진입: {}", commentId);
        try {
            commentService.deleteCommentById(commentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("댓글 삭제 실패 : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 댓글수정
     * PUT /api/comments/{commentId}
     * updateComment
     */
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Boolean> updateComment(@PathVariable int commentId,
                                                 @RequestBody String commentContent) {
        try {
            boolean r = commentService.updateComment(commentId,commentContent);
            return ResponseEntity.ok(r);
        } catch (Exception e) {
            log.error("댓글 수정 문제 발생 : {}", e.getMessage());
            return ResponseEntity.badRequest().body(false);
        }

    }
}
