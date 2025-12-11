// ============================================
// src/pages/LoginPage.jsx
// 로그인 페이지 UI 및 기능 구현
// - username, password state 선언
// - loading state 선언
// - handleLogin 함수: apiService.login 호출
// - 로그인 성공 시 token과 user를 localStorage에 저장
// - 로그인 성공 시 /feed로 이동
// - Enter 키 입력 시 로그인 처리
// ============================================

import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import apiService from '../service/apiService';

const LoginPage = () => {
    // username state를 선언하세요
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');

    // password state를 선언하세요
    const [password, setPassword] = useState('');

    // loading state를 선언하세요
    const [loading, setLoading] = useState(false);

    // useNavigate를 사용하여 navigate 함수를 가져오세요
    const navigate = useNavigate();

    // handleLogin 함수를 작성하세요
    const handleLogin = async () => {
        // 1. 입력값 검증 (username과 password가 비어있는지 확인)
        if(!username && username.trim() == "" && !password && password.trim() == "") {
            return;
        }

        try {
            // 2. loading을 true로 설정
            setLoading(true);
            // 3. apiService.login(username, password) 호출
            // 4. 성공 시: localStorage에 token과 user 저장, /feed로 이동
            const res = await apiService.login(userEmail, password);
            alert("로그인 성공!");
            navigate("/feed");
        } catch(err) {
            // 5. 실패 시: alert로 에러 메시지 표시
            if(err.response?.status === 401) {
                alert("이메일 또는 비밀번호가 올바르지 않습니다.");
            } else {
                alert("로그인에 실패했습니다. 다시 로그인해주세요.");
            }
        } finally {
            // 6. finally: loading을 false로 설정
            setLoading(false);
        }
    };

    const handleKakaoLogin = () => {
        const API_KEY = process.env.REACT_APP_KAKAO_CLIENT_ID;
        const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URL;
        console.log("✨ API_KEY : ", API_KEY);
        console.log("REDIRECT_URI : ", REDIRECT_URI);
        if(!API_KEY || !REDIRECT_URI) {
            alert("✨ 카카오 설정 오류 : 환경변수를 확인해주세요.");
            return;
        }
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        window.location.href = kakaoAuthUrl;
    };

    // Enter 키 입력 시 handleLogin 호출하는 함수
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-card">
                    <h1 className="login-title">Instagram</h1>

                    <div>
                        <input
                            type="text"
                            placeholder="전화번호, 사용자 이름 또는 이메일"
                            value={userEmail}
                            onChange={e => setUserEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />

                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />

                        <button className="login-button"
                                onClick={handleLogin}
                                disabled={loading}
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </button>
                    </div>

                    <div className="divider">
                        <div className="divider-line"></div>
                        <span className="divider-text">또는</span>
                        <div className="divider-line"></div>
                    </div>

                    <button className="facebook-login">
                        Facebook으로 로그인
                    </button>

                    <img src="/static/img/kakao_login_large_wide.png"
                         onClick={handleKakaoLogin}
                    />

                    <button className="forgot-password">
                        비밀번호를 잊으셨나요?
                    </button>
                </div>

                <div className="signup-box">
                    <p>
                        계정이 없으신가요?
                        <button className="signup-link"
                                onClick={() => navigate("/signup")}
                        >
                            가입하기
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;