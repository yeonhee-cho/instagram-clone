// ============================================
// src/service/apiService.js
// TODO: Axios를 이용한 API 호출 함수 작성
// - axios import 하기
// - API_BASE_URL 설정 (http://localhost:8080/api)
// - axios 인스턴스 생성
// - 요청 인터셉터: 모든 요청에 Authorization 헤더 추가
// - 응답 인터셉터: 401 에러 시 로그인 페이지로 이동
// ============================================

import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000/api';

// TODO: axios 인스턴스를 생성하세요
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type' : 'application/json',
    }
})

// TODO: 요청 인터셉터를 설정하세요
// localStorage에서 token을 가져와서 Authorization 헤더에 추가
// 모든 요청에 JWT 토큰 추가
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// TODO: 응답 인터셉터를 설정하세요
// 401 에러가 발생하면 localStorage를 비우고 /login으로 이동
/*
export const 기능1번 = () => {}

const 기능2번 = {
    회원가입기능 : () => {},
    로그인기능 : () => {}
}
*/
/*
export default 기능2번;
*/

// 기능 2번과 같은 형태로 함수 활용
const apiService = {
    // ===== 인증 API =====

    // TODO: 회원가입 API
    // POST /auth/signup
    // body: { username, email, password, fullName }
    signup: async (username, email, password, fullName) => {
        // TODO: API 호출을 완성하세요
        const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
            username: username,
            email: email,
            password: password,
            fullName: fullName,
        });
        return response.data;
    },

    // TODO: 로그인 API
    // POST /auth/login
    // body: { username, password }
    login: async (username, password) => {
        // TODO: API 호출을 완성하세요
        //JWT
        const res = await axios.post(`${API_BASE_URL}/auth/login`,
            {
                       userMame: username,
                       userPassword: password
                   },
            {withCredentials:true}
                .then(
                    res => {

                    }
                ).catch(err => {
                console.log("로그인 에러 : ", err);
                return {
                    success: false,
                    message: '로그인 중 오류가 발생했습니다.'
                }
            })
        )
    },

    // TODO: 로그아웃 함수
    // localStorage에서 token과 user 제거하고 /login으로 이동
    logout: () => {
        // TODO: 로그아웃 로직을 완성하세요
    },

    // ===== 게시물 API =====

    // TODO: 모든 게시물 조회
    // GET /posts
    getPosts: async () => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 특정 게시물 조회
    // GET /posts/:postId
    getPost: async (postId) => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 게시물 작성
    // POST /posts
    // body: { postImage, postCaption, postLocation }
    createPost: async (postImage, postCaption, postLocation) => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 게시물 삭제
    // DELETE /posts/:postId
    deletePost: async (postId) => {
        // TODO: API 호출을 완성하세요
    },

    // ===== 좋아요 API =====

    // TODO: 좋아요 추가
    // POST /posts/:postId/like
    addLike: async (postId) => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 좋아요 취소
    // DELETE /posts/:postId/like
    removeLike: async (postId) => {
        // TODO: API 호출을 완성하세요
    },

    // ===== 댓글 API =====

    // TODO: 댓글 목록 조회
    // GET /posts/:postId/comments
    getComments: async (postId) => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 댓글 작성
    // POST /posts/:postId/comments
    // body: { commentContent }
    createComment: async (postId, commentContent) => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 댓글 삭제
    // DELETE /comments/:commentId
    deleteComment: async (commentId) => {
        // TODO: API 호출을 완성하세요
    },

    // ===== 스토리 API =====

    // TODO: 스토리 목록 조회
    // GET /stories
    getStories: async () => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 스토리 작성
    // POST /stories
    // body: { storyImage }
    createStory: async (storyImage) => {
        // TODO: API 호출을 완성하세요
    },

    // ===== 사용자 API =====

    // TODO: 사용자 프로필 조회
    // GET /users/:userId
    getUser: async (userId) => {
        // TODO: API 호출을 완성하세요
    },

    // TODO: 사용자 게시물 조회
    // GET /users/:userId/posts
    getUserPosts: async (userId) => {
        // TODO: API 호출을 완성하세요
    }
};

export default apiService;