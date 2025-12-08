// ============================================
// src/pages/UploadPage.jsx
// TODO: 업로드 페이지 UI 및 기능 구현
// - selectedImage, imagePreview, caption, location, loading state 선언
// - handleImageChange: 파일 선택 시 미리보기 생성
// - handlePost: 게시물 업로드 (입력값 검증, API 호출, /feed 이동)
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';
import { ArrowLeft, Image } from 'lucide-react';

const UploadPage = () => {
    // selectedImage state를 선언하세요
    const [selectedImage, setSelectedImage] = useState(null);

    // imagePreview state를 선언하세요
    const [imagePreview, setImagePreview] = useState(null);

    // caption state를 선언하세요
    const [caption, setCaption] = useState('');

    // location state를 선언하세요
    const [location, setLocation] = useState('');

    // loading state를 선언하세요
    const [loading, setLoading] = useState(false);

    // useNavigate를 사용하여 navigate 함수를 가져오세요
    const navigate = useNavigate();

    // TODO: localStorage에서 user 정보를 가져오세요
    const user = JSON.parse(localStorage.getItem('user') || {});

    // TODO: handleImageChange 함수를 작성하세요
    const handleImageChange = (e) => {
        // TODO: 함수를 완성하세요
        // 1. e.target.files[0]으로 파일 가져오기
        const imageFile = e.target.files[0];
        // 2. 파일이 있으면 selectedImage에 저장
        if(imageFile) {
            setSelectedImage(imageFile);
            // 3. FileReader를 사용하여 base64로 변환
            const reader = new FileReader();
            // 4. imagePreview에 base64 데이터 저장
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(imageFile);
        }
    }

    // TODO: handlePost 함수를 작성하세요
    // 1. 입력값 검증 (selectedImage와 caption이 있는지 확인)
    // 2. loading을 true로 설정
    // 3. apiService.createPost(imagePreview, caption, location) 호출
    // 4. 성공 시: alert로 성공 메시지, /feed로 이동
    // 5. 실패 시: alert로 에러 메시지
    // 6. finally: loading을 false로 설정
    const handlePost = async () => {
        // TODO: 함수를 완성하세요
        if(!selectedImage || !caption.trim()) {
            alert("이미지와 캡션을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            await apiService.createPost(imagePreview, caption, location);
            alert("게시물이 성공적으로 등록되었습니다.");
            navigate("/feed");
        } catch (e) {
            alert("게시물 등록에 실패했습니다." + e);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationChange = () => {
        const loc = prompt('위치를 입력하세요.');
        if(loc) setLocation(loc);
    }

    // <img class="upload-user-avatar" src="default-avatar.png">
    // user.userAvatar로 가져 온 이미지가 엑스박스 일 때
    const avatarImage = user.userAvatar && user.userAvatar.trim() !== '' ?
        user.userAvatar : '/static/img/default-avatar.jpg';

    const handleAvatarError = (e) => {
        e.target.src = '/static/img/default-avatar.jpg';
    }

    return (
        <div className="upload-container">
            {/* TODO: 헤더 작성 */}
            <header className="upload-header">
                <div className="upload-header-content">
                    {/* TODO: 뒤로가기 버튼 (onClick: /feed로 이동) */}
                    <button className="upload-back-btn"
                            onClick={() => navigate("/feed")}
                    >
                        <ArrowLeft size={24}/>
                    </button>

                    <h2 className="upload-title">새 게시물</h2>

                    {/* TODO: 공유 버튼 (onClick: handlePost, disabled: loading) */}
                    <button className="upload-submit-btn"
                            onClick={handlePost}
                            disabled={loading}
                    >
                        {loading ? '등록 중...' : '공유'}
                    </button>
                </div>
            </header>

            <div className="upload-content">
                <div className="upload-card">
                    {/* TODO: 이미지 업로드 영역 작성 */}
                    <div className="upload-image-area">
                        {/* TODO: imagePreview가 있으면 이미지 표시, 없으면 업로드 UI 표시 */}
                        {/* FileReader로 변환한 base64 이미지를 img src에 사용 */}
                        {/* input type="file" accept="image/*" onChange={handleImageChange} */}
                        {imagePreview ? (
                            <>
                                <img src={imagePreview}
                                     className="upload-preview-image"/>
                                <label className="upload-change-btn">
                                    이미지 변경
                                    <input type="file"
                                           accept="image/*"
                                           onChange={handleImageChange}
                                           className="upload-file-input"
                                    />
                                </label>
                            </>
                        ): (
                            <label className="upload-label">
                                <Image className="upload-icon" />
                                <span className="upload-text">
                                    사진을 선택하세요.
                                </span>
                                <span className="upload-select-btn">
                                    컴퓨터에서 선택
                                </span>
                                <input type="file"
                                       accept="image/*"
                                       onChange={handleImageChange}
                                       className="upload-file-input"
                                />
                            </label>
                        )
                        }
                    </div>

                    {/* TODO: 캡션 입력 영역 작성 */}
                    <div className="upload-caption-area">
                        <div className="upload-caption-content">
                            {/* TODO: 프로필 이미지 표시 */}
                            <img className="upload-user-avatar"
                                   src={avatarImage}
                                 onError={handleAvatarError}
                            />

                            <div className="upload-caption-right">
                                {/* TODO: 사용자명 표시 */}
                                <div className="upload-username">
                                    {user.userName}
                                </div>

                                {/* textarea로 캡션 입력 */}
                                {/* placeholder: "문구를 입력하세요..." */}
                                {/* value: caption */}
                                {/* onChange: setCaption */}
                                <textarea placeholder="문구를 입력하세요."
                                          value={caption}
                                          onChange={(e) => setCaption(e.target.value)}
                                          rows={4}
                                          className="upload-caption-input"
                                />
                                {/* TODO: 글자 수 표시 (예: 0/2,200) */}
                                <div className="upload-caption-content">
                                    {caption.length}/2,200
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TODO: 추가 옵션 (위치 추가, 태그하기) */}
                    <div className="upload-options">
                        <button className="upload-option-btn"
                                onClick={handleLocationChange}
                        >
                            <span className="upload-option-text">{location || '위치 추가'}</span>
                            <span className="upload-option-arrow">›</span>
                        </button>
                        <button className="upload-option-btn">
                            <span className="upload-option-text">태그하기</span>
                            <span className="upload-option-arrow">›</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;