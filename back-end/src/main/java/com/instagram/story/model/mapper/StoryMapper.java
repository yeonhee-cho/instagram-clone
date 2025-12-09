package com.instagram.story.model.mapper;

import com.instagram.story.model.dto.Story;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface StoryMapper {
    // 스토리 생성
    void insertStory(Story story);

    // 모든 스토리 조회
    List<Story> selectAllStories();

    // 업데이트 
    void updateStoryImage(int storyId, String storyImage);

    // 특정 사용자 조회
    Story selectStoriesByUserId(int id);

    // 만료된 스토리 void updateStory(Story story);
}
