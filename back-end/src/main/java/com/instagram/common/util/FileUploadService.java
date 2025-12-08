package com.instagram.common.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileUploadService {
    // application.properties
    @Value("${file.profile.upload.path}")
    private String profileUploadPath;

    @Value("${file.story.upload.path}")
    private String storyUploadPath;

    @Value("${file.post.upload.path}")
    private String postUploadPath;

    /**
     * 프로필 이미지 업로드
     */
    public String uploadProfileImage(MultipartFile file) throws IOException {
        // 비어 있는 파일 체크
        if(file.isEmpty()){
            throw new IOException("❌ 업로드할 파일이 없습니다.");
        }

        // 폴더 경로(File 객체 생성)
        File uploadDir = new File(profileUploadPath);
        // 저장될 폴더가 아예 없으면 새로 생성
        if(!uploadDir.exists()){
            boolean created = uploadDir.mkdirs(); // 폴더 생성
            if(!created){
                throw new IOException("❌ 업로드 디렉토리 생성에 실패했습니다: " + profileUploadPath);
            }
            log.info("⭕ 업로드 디렉토리 생성: {}", profileUploadPath);
        }

        // 업로드한 이미지 원본 파일명 가져오기
        String clientUploadToFileName = file.getOriginalFilename(); // 업로드한 이미지 원본 파일명
        if(clientUploadToFileName == null || clientUploadToFileName.isEmpty()){
            throw new IOException("❌ 파일 이름이 유효하지 않습니다.");
        }

        // 확장자 가져오기
        String extension = "";
        int lastDotIndex = clientUploadToFileName.lastIndexOf('.');
        if(lastDotIndex > 0){
            extension = clientUploadToFileName.substring(lastDotIndex);
        }

        // UUID + 확장자로 새로운 파일명 생성
        String reFilename = UUID.randomUUID().toString() + extension;

        // 파일 저장될 실제 경로
        Path filePath = Paths.get(profileUploadPath, reFilename);

        // 파일 저장
        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            log.info("⭕ 프로필 이미지 업로드 성공: {} -> {}", clientUploadToFileName, reFilename);
        } catch (IOException e) {
            log.error("❌ 파일 저장 중 오류 발생: {}", e.getMessage());
            throw new IOException("파일 저장에 실패했습니다: " + e.getMessage());
        }
        return "/profile_images/" + reFilename;
    }

    /**
     * 스토리 이미지 업로드
     */
    public String uploadStoryImage(MultipartFile file, int storyId, String imageType) throws IOException {
        if(file == null || file.isEmpty()){
            throw new IOException("❌ 업로드할 파일이 없습니다.");
        }

        String storyFolder = storyUploadPath + "/" + storyId;

        File uploadDir = new File(storyFolder);
        if(!uploadDir.exists()){
            boolean created = uploadDir.mkdirs();
            if(!created){
                throw new IOException("❌ 스토리 이미지 디렉토리 생성을 실패했습니다: " + storyFolder);
            }
            log.info("⭕ 스토리 이미지 디렉토리 생성: {}", storyFolder);
        }

        String clientUploadFileName = file.getOriginalFilename();
        if(clientUploadFileName == null || clientUploadFileName.isEmpty()){
            throw new IOException("❌ 파일 이름이 유효하지 않습니다.");
        }

        String fileName = imageType + "-" + clientUploadFileName;
        Path saveToPath = Paths.get(storyFolder, fileName);

        try {
            Files.copy(file.getInputStream(), saveToPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("⭕ 스토리 이미지 업로드 성공: {} -> {}", clientUploadFileName, fileName);
        } catch (Exception e) {
            log.error("❌ 스토리 이미지 저장 중 오류 발생: {}", e.getMessage());
            throw new IOException("스토리 이미지 저장에 실패했습니다: " + e.getMessage());
        }

        return "/story_images/" + storyId + "/" + fileName;
    }

    /**
     * 게시물 이미지 업로드
     */
    public String uploadPostImage(MultipartFile file) throws IOException {
        if(file == null || file.isEmpty()) {
            throw new IOException("❌ 업로드할 파일이 없습니다.");
        }

        File uploadDir = new File(postUploadPath);
        if(!uploadDir.exists()){
            boolean created = uploadDir.mkdirs();
            if(!created){
                throw new IOException("❌ 게시물 이미지 디렉토리 생성을 실패했습니다: " + postUploadPath);
            }
            log.info("⭕ 게시물 이미지 디렉토리 생성: {}", postUploadPath);
        }

        String clientUploadFileName = file.getOriginalFilename();
        if(clientUploadFileName == null || clientUploadFileName.isEmpty()){
            throw new IOException("❌ 파일 이름이 유효하지 않습니다.");
        }

        String extension = "";
        int lastDotIndex = clientUploadFileName.lastIndexOf('.');
        if(lastDotIndex > 0){
            extension = clientUploadFileName.substring(lastDotIndex);
        }

        String fileName = UUID.randomUUID().toString() + extension;
        Path saveToPath = Paths.get(postUploadPath, fileName);

        try{
            Files.copy(file.getInputStream(), saveToPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("⭕ 게시물 이미지 업로드 성공: {} -> {}", clientUploadFileName, fileName);
        } catch (Exception e){
            log.error("❌ 게시물 이미지 저장 중 오류 발생: {}", e.getMessage());
            throw new IOException("❌ 게시물 이미지 저장에 실패했습니다: " + e.getMessage());
        }

        return "/post_images/" + fileName;
    }

    /**
     * 서버에 저장된 파일 삭제
     */
    public boolean deleteFile(String dbPathImg) {
        // 유효성 검사
        if(dbPathImg == null || dbPathImg.isEmpty()) {
            log.warn("❌ 삭제할 파일 경로가 존재하지 않습니다.");
            return false;
        }

        try {
            String absolutePath;

            // 프로필 이미지 삭제
            if(dbPathImg.startsWith("/profile_images/")) {
                String profileImgPath = dbPathImg.replace("/profile_images/", "");
                absolutePath = profileUploadPath + "/" + profileImgPath;
            }
            // 스토리 이미지 삭제
            else if (dbPathImg.startsWith("/story_images/")) {
                String storyImgPath = dbPathImg.replace("/story_images/", "");
                absolutePath = storyUploadPath + "/" + storyImgPath;
            }
            // 게시물 이미지 삭제
            else if (dbPathImg.startsWith("/post_images/")) {
                String postImgPath = dbPathImg.replace("/post_images/", "");
                absolutePath = postUploadPath + "/" + postImgPath;
            }
            // 파일 형식 오류
            else {
                log.warn("❌ 지원하지 않는 파일 경로 형식입니다: {}", dbPathImg);
                return false;
            }

            File file = new File(absolutePath);

            // 실제 파일 존재 여부 확인
            if(!file.exists()){
                log.warn("❌ 삭제하려는 파일이 존재하지 않습니다: {}", absolutePath);
                return false;
            }

            // 파일 삭제
            boolean fileRemove = file.delete();

            if(fileRemove) {
                log.info("⭕ 파일 삭제 성공: {}", absolutePath);
            } else {
                log.error("❌ 파일 삭제 실패: {}", absolutePath);
            }
            return fileRemove;

        } catch (Exception e) {
            log.error("❌ 파일 삭제 중 오류 발생: {}", e.getMessage());
            return false;
        }
    }
}