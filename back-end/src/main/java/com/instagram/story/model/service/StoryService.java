package com.instagram.story.model.service;

import com.instagram.story.model.dto.Story;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface StoryService {
    // 스토리 생성
    Story createStory(int userId, MultipartFile storyImage) throws IOException;

    // 모든 스토리 조회
    List<Story> getAllStories();

    // 특정 사용자 조회
    List<Story> getStoriesByUserId(int userId);

    void deleteExpiredStories();
}
