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