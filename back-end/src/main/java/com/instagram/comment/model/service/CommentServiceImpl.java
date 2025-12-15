package com.instagram.comment.model.service;

import com.instagram.comment.model.dto.Comment;
import com.instagram.comment.model.dto.CommentResponse;
import com.instagram.comment.model.mapper.CommentMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.Comments;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentMapper commentMapper;

    /*
     * 댓글 개수를 고려하지 않고, 단순 댓글들만 필요한 경우
    @Override
    public List<Comment> getCommentsByPostId(int postId) {
        // 댓글 개수 전달
        return commentMapper.selectCommentsByUserId(postId);
    }
     */

    @Override
    public CommentResponse getCommentsByPostId(int postId) {
        // log.info("📌 getCommentsByPostId 진입: {}", postId);
        // 댓글 개수 전달
        List<Comment> c = commentMapper.selectCommentsByPostId(postId);
        log.info("📌 c: {}", c);
        CommentResponse cr = new CommentResponse();
        log.info("📌 cr: {}", cr);
        cr.setComments(c);
        cr.setCommentCount(c.size());
        return cr;
    }

    @Override
    public boolean createComment(int postId, int userId, String commentContent) {
        try {
           Comment comment = new Comment();
           comment.setPostId(postId);
           comment.setUserId(userId);
           comment.setCommentContent(commentContent);
           return commentMapper.insertComment(comment) > 0;
        } catch (Exception e) {
            log.error("댓글 작성 실패 : ", e.getMessage());
            return false;
        }
    }

    @Override
    public void deleteCommentById(int commentId) {
        log.info("📌 commentId: {}", commentId);
        try {
            log.info("여기 try");
            Comment comment = commentMapper.selectCommentsByCommentId(commentId);
            log.info("comment:{}", comment);
            if(comment == null) log.warn("❌ 댓글을 찾을 수 없습니다. - 댓글 ID : {}", commentId);
            commentMapper.deleteCommentById(commentId);
            log.info("✅ 댓글 DB 삭제 완료 - 댓글 ID : {}", commentId);
        } catch (Exception e) {
            log.error("❌ 댓글 삭제 중 오류 발생 : {}", e.getMessage());
            throw new RuntimeException("❌ 댓글 삭제 실패", e);
        }
    }

    @Override
    public boolean updateComment(int commentId, String commentContent) {
        return commentMapper.updateComment(commentId, commentContent ) > 0;
    }
}
