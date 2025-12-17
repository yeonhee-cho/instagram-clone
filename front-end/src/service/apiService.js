// ============================================
// src/service/apiService.js
// Axios를 이용한 API 호출 함수 작성
// - axios import 하기
// - API_BASE_URL 설정 (http://localhost:8080/api)
// - axios 인스턴스 생성
// - 요청 인터셉터: 모든 요청에 Authorization 헤더 추가
// - 응답 인터셉터: 401 에러 시 로그인 페이지로 이동
// ============================================

import axios from 'axios';
import config from "tailwindcss/defaultConfig";

axios.defaults.withCredentials = true; // 쿠키 포함 허용 설정

// 백엔드 API 기본 주소
export const API_BASE_URL = '/api';

// axios 인스턴스 생성
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type' : 'application/json',
    }
})

// 요청 인터셉터 설정
// 모든 API 요청 전에 실행되는 함수
// localStorage에서 token을 가져와서 Authorization 헤더에 `Bearer ${token}` 추가
// 모든 요청에 JWT 토큰 추가
// 사용자의 요청을 가로채다 = interceptor
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token'); // 저장된 JWT 가져오기
        // 토큰이 있으면 헤더에 추가
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// 응답 인터셉터 설정
// 401 에러가 발생하면 localStorage를 비우고 /login으로 이동
/**
 * 401: 인증 안 됨 : 로그인을 안했거나, 토큰 만료
 *     -> 로그인 페이지로 이동(토큰 만료, 토큰이 임의로 삭제, 잘못된 토큰 = 누군가가 토큰을 임의로 조작)
 * 403: 권한 없음 : 로그인은 했지만, 접근할 권한 부족 - 사업자
 *     -> 권한 없습니다. 알림 처리, 이전 페이지로 돌려보내거나 메인 페이지로 돌려보내기
 * 404: 없음 : 게시물 / 사용자 / 페이지 없음
 *     -> 찾을 수 없습니다. 알림 이전 페이지로 돌려보내거나 메인 페이지로 돌려보내기
 * 500: 서버 에러 : 서버 문제
 *     -> 고객 센터 연락 방법 띄우기
 */
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if(error.response && error.response.status === 401) {
            // 로그인 유저 정보 제거
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // 로그인 페이지 이동
            window.location.href = '/login';
        }
    }
)

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

    // 회원가입 API
    // POST /auth/signup
    // body: { username, email, password, fullName }
    signup: async (username, email, password, fullName) => {
        // 회원 정보 전달하여 회원가입 요청
        const response = await api.post('/auth/signup', {
            userName: username,
            userEmail: email,
            userPassword: password,
            userFullname: fullName,
        });
        return response.data;
    },

    // 로그인 API
    // POST /auth/login
    // body: { username, password }
    login: async (userEmail, password) => {
        //JWT
        const res = await api.post('/auth/login', {
            userEmail: userEmail,
            userPassword: password,
        });

        // 토큰과 사용자 정보를 localStorage 저장
        if(res.data.token) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        return res.data;
    },

    // 로그아웃 함수
    // localStorage에서 token과 user 제거하고 /login으로 이동
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    // ===== 게시물 API =====

    // 모든 게시물 조회
    // GET /posts
    getPosts: async () => {
        const res = await api.get('/posts');
        console.log('✅ posts.data', res.data);
        return res.data;
    },

    // 특정 게시물 조회
    // GET /posts/:postId
    // user or my 추가
    getUserPost: async (userId) => {
        const res = await api.get(`/posts/user/${userId}`);
        console.log('✅ 특정 게시물 조회', res.data);

        return res.data;
    },

    // getMyPost: async (userId) => {
    //     const res = await api.get(`/posts/my/${userId}`);
    //     console.log('✅ 특정 게시물 조회', res.data);
    //
    //     return res.data;
    // },

    // 단순 getPost 사용
    getPost : async (postId) => {
        const res = await api.get(`/posts/${postId}`);
        return res.data;
    },

    // 게시물 작성
    // POST /posts
    // body: { postImage, postCaption, postLocation }
    createPost: async (postImage, postCaption, postLocation) => {
        const postFormData = new FormData();
        postFormData.append('postImage', postImage);
        postFormData.append('postCaption', postCaption);
        postFormData.append('postLocation', postLocation);

        const res = await api.post("/posts", postFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return res.data; // 서버 응답 반환
    },

    // TODO: 게시물 삭제
    // DELETE /posts/:postId
    deletePost: async (postId) => {
        // TODO: API 호출을 완성하세요
    },

    // ===== 좋아요 API =====

    // 좋아요
    // POST /posts/:postId/like
    addLike: async (postId) => {
        console.log("postId",postId)
        const res = await api.post(`/posts/${postId}/like`);
        console.log("✅ 좋아요 +",res.data);
        return res.data;
    },

    // 좋아요 취소
    // DELETE /posts/:postId/like
    removeLike: async (postId) => {
        console.log("postId",postId)
        const res = await api.delete(`/posts/${postId}/like`);
        console.log("✅ 좋아요 취소",res.data);
        return res.data;
    },

    // ===== 댓글 API =====

    // 댓글 목록 조회
    // GET /posts/:postId/comments
    getComments: async (postId) => {
        console.log("댓글 목록 조회");
        const res = await api.get(`/posts/${postId}/comments`);
        console.log("댓글 목록 조회 res.data", res.data);
        return res.data;
    },

    // 댓글 작성
    // POST /posts/:postId/comments
    // body: { commentContent }
    createComment: async (postId, commentContent) => {
        const res = await api.post(`/posts/${postId}/comments`, {
            commentContent : commentContent,
        });
        // console.log("✅ 댓글 작성 res.data", res.data);
        return res.data;
    },

    // 댓글 삭제
    // DELETE /comments/:commentId
    deleteComment: async (commentId) => {
        console.log("댓글 삭제", commentId);
        const res = await api.delete(`/comments/${commentId}`);
        console.log("댓글 삭제 res.data", res.data);
        return res.data;
    },

    // ===== 스토리 API =====

    // 스토리 목록 조회
    // GET /stories
    getStories: async () => {
        const res = await api.get('/stories');
        console.log('✅ stories.data', res.data);
        return res.data;
    },

    getStory : async (userId) => {
        try {
            console.log("getStory");
            const res = await api.get(`/stories/user/${userId}`);
            console.log('✅ stories.data,userId', res.data);
            return res.data;
        } catch (err) {
            console.error("❌ 스토리 조회 에러 : ", err.response?.data || err.message);
        }
    },

    // 스토리 작성
    // POST /stories
    // body: { storyImage }
    createStory: async (storyImage) => {
        const storyFormData = new FormData();
        storyFormData.append('storyImage', storyImage);

        const res = await api.post("/stories", storyFormData, {
            headers: {
                'Content-Type':'multipart/form-data'
            }
        });

        return res.data;
    },

    // 스토리 삭제
    deleteStory: async (storyId) => {
        const res = await api.delete(`stories/${storyId}`);
        console.log("✅ 스토리 삭제", res.data);
        return res.date;
    },

    // ===== 사용자 API =====

    // 사용자 프로필 조회
    // GET /users/:userId
    getUser: async (userId) => {
        const res = await api.get(`/users/${userId}`);
        console.log("✅ 사용자 프로필 조회", res.data);
        return res.data;
    },

    // 사용자 게시물 조회
    // GET /users/:userId/posts
    getUserPosts: async (userId) => {
        const res = await api.get(`/users/${userId}/post`);
        console.log("✅ 사용자 게시물 조회", res.data);
        return res.data;
    },

    // updateProfile 함수
    // PUT /users/:userId
    // 파라미터: userId, formData
    // 헤더: 'Content-Type': 'multipart/form-data'
    // 성공 시 localStorage의 'user' 업데이트
    updateProfile: async (userId, formData) => {
        try{
            // 1. api.put() 호출
            const res = await api.put(`/auth/profile/edit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("✅ updateProfile", res.data);

            if(res.data) {
                // 2. res.data가 있으면 localStorage.setItem('user', JSON.stringify(res.data))
                // 성공 시 localStorage의 'user' 업데이트
                localStorage.setItem('user', JSON.stringify(res.data));
                const token = localStorage.getItem('token');
                if(token) {
                    localStorage.setItem('token', token);
                }
            } else {
                // 3. res.data 반환
                return res.data;
            }
        } catch (err) {
            return Promise.reject(err);
        }
    },

    // 유저 검색 API 호출 함수 구현
    // GET /api/users/search?q={query}
    searchUsers: async (query) => {
        // 요구사항:
        // 1. query가 없으면 빈 배열 반환
        if(!query) return [];
        try {
            // 2. api.get()을 사용하여 `/users/search?q=${query}` 호출
            const res = await api.get(`/users/search?q=${query}`);
            // 3. 성공 시 res.data 반환
            return res.data;
        } catch (err) {
            // 4. 에러 발생 시 콘솔에 로그 출력 후 빈 배열 반환
            console.log("유저 검색 실패 : ", err);
            return [];
            // q=${encodeURIComponent(query}
        }

    },

    // 유저네임으로 유저 조회 API 호출 함수 구현
    // GET /api/users/username/{username}
    getUserByUsername: async (username) => {
        try {
            // 1. api.get()을 사용하여 `/users/username/${username}` 호출
            const res = await api.get(`/users/username/${username}`);
            console.log("유저네임으로 유저 조회", res.data);
            // 2. 성공 시 res.data 반환
            return res.data;
        } catch (err) {
            // 3. 에러 발생 시 콘솔에 로그 출력 후 null 반환
            console.log("유저 조회 실패 : ", err);
            return null;
        }
    },
};

export default apiService;