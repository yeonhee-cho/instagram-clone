// src/service/commonService.js

// API_BASE_URL 상수 선언
export const API_BASE_URL = "http://localhost:9000";

/**
 * 이미지 경로를 받아서 완전한 URL을 반환하는 함수
 * @param {string} path - DB에 저장된 이미지 경로
 * @returns {string} - 보여줄 수 있는 전체 이미지 URL
 */
export const getImageUrl = (path) => {
    const defaultImage = '/static/img/default-avatar.jpg';
    // 1-2: path가 없거나 null인 경우
    // '/static/img/default-avatar.jpg' 반환
    if(!path) return defaultImage;
    // 1-3: path가 'http'로 시작하는 경우 (외부 링크)
    // 그대로 반환
    if(path.startsWith('http')) return path;
    // 1-4: path가 'default-avatar.jpg' 또는 'default-avatar.png'인 경우
    // '/static/img/default-avatar.jpg' 반환
    if(path === 'default-avatar.jpg') return defaultImage;
    // 1-5: 그 외의 경우
    // `${API_BASE_URL}${path}` 형태로 반환
    if(path === 'default-avatar.png') return defaultImage;

    return `${API_BASE_URL}${path}`
};

/**
 * commonService 에 현재 날짜를 몇 시간 전에 업로드했는지 formatDate 메서드 사용하여 날짜 변환
 * <span className="story-time">
 *     {storyData.createdAt}
 * </span>
 *
 * formatDate 형태로 1시간 1분전 업로드 형태 수정
 * 또는
 * formatDate 형태로 yyyy-mm-dd 형태로 확인 수정
 */

export const formatDate = (dateString, format = "relative") => {
    if(!dateString) return '-';
    // 클라이언트가 스토리를 업데이트 한 시간
    const date = new Date(dateString);
    // 현재 시간
    const now = new Date();
    // const diff = (now - date) / 1000;
    // if (diff < 60) return "방금 전"; // 1분
    // if (diff < 3600) return `${Math.floor(diff / 60)}분 전`; // 1시간
    // if (diff < 43200) return `${Math.floor(diff / 3600)}시간 전`; // 12시간
    // if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`; // 24시간
    // if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`; // 30일

    // yyy-MM-dd 로 변환
    if(format === "absolute") {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    // relative 형태로 반환, 기본 값으로 설정
    // now 현재 2025년 12월 11일 10시 03분
    // date = story 올린 과거 시간
    const diffInMs = now - date;
    const diffInSecondes = Math.floor(diffInMs / 1000); // 1초 = 1000 초로 변환
    const diffInMinutes = Math.floor(diffInSecondes / 60); // 초를 60으로 나누면 분 단위
    const diffInHours = Math.floor(diffInMinutes / 60); // 분을 60으로 나누면 시 단위
    const diffInDays = Math.floor(diffInMinutes / 24); // 시를 24로 나누면 날짜 단위

    if(diffInSecondes < 60) {
        return '방금 전'
    } else if(diffInMinutes < 60) {
        return `${diffInMinutes}분 전`
    } else if(diffInHours < 24) {
        const minutes = diffInMinutes % 60;
        if(minutes > 0){
            return `${diffInHours} 시간 ${minutes}분 전`
        }
        return `${diffInHours}시간 전`
    } else if(diffInDays < 7) {
        // 7일 이상 이면 날짜 형식으로 표시
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }
}