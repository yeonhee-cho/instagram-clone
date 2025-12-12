// ============================================
// src/pages/PostUploadPage.jsx
// 업로드 페이지 UI 및 기능 구현
// - selectedImage, imagePreview, caption, location, loading state 선언
// - handleImageChange: 파일 선택 시 미리보기 생성
// - handlePost: 게시물 업로드 (입력값 검증, API 호출, /feed 이동)
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';
import { ArrowLeft, Image } from 'lucide-react';
import {getFilteredFile, FILTER_OPTIONS} from "../service/filterService";
import Header from "../components/Header";
import MentionInput from "../components/MentionInput";

/* 필요에 따라 소비자가 업로드 한 이미지를 리사이즈 처리화 해야할 수 있다. 
* 예) 10mb 이상의 이미지를 올리면 8mb 이하의 이미지로 사이즈 축소, 크기 축소*/
const PostUploadPage = () => {
    // selectedImage state 선언
    const [selectedImage, setSelectedImage] = useState(null);

    // imagePreview state 선언
    const [imagePreview, setImagePreview] = useState(null);

    // caption state 선언
    const [caption, setCaption] = useState('');

    // location state 선언
    const [location, setLocation] = useState('');

    // loading state 선언
    const [loading, setLoading] = useState(false);

    // 필터 값
    const [selectedFilter, setSelectedFilter] = useState('none');

    // navigate
    const navigate = useNavigate();

    // user 정보
    const user = JSON.parse(localStorage.getItem('user') || {});

    const handleImageChange = (e) => {
        // 1. e.target.files[0]으로 파일 가져오기
        const imageFile = e.target.files[0];

        // 2. 파일이 있으면 selectedImage에 저장
        if(imageFile) {
            setSelectedImage(imageFile);
            // 3. FileReader를 사용하여 base64로 변환
            const reader = new FileReader();
            // 4. imagePreview에 base64 데이터 저장
            reader.onloadend = () => {
                setImagePreview(reader.result); // base64 URL 생성
                setSelectedFilter('none'); // 이미지 변경 시 필터 초기화
            };
            reader.readAsDataURL(imageFile);
        }
    }

    const handlePost = async () => {

        // 1. 입력값 검증 (selectedImage와 caption이 있는지 확인)
        if(!selectedImage || !caption.trim()) {
            alert("이미지와 캡션을 입력해주세요.");
            return;
        }

        try {
            // 2. loading을 true로 설정
            setLoading(true);
            // -  필터가 적용된 이미지 파일 생성한 데이터에 변수 담기
            const filteredImage = await getFilteredFile(selectedImage, selectedFilter);
            // -  필터가 적용된 이미지를 서버에 전송
            // 3. apiService.createPost(imagePreview, caption, location) 호출
            await apiService.createPost(filteredImage, caption, location);
            // 4. 성공 시: alert로 성공 메시지, /feed로 이동
            alert("게시물이 성공적으로 등록되었습니다.");
            navigate("/feed");
        } catch (err) {
            // 5. 실패 시: alert로 에러 메시지
            alert("게시물 등록에 실패했습니다.");
        } finally {
            // 6. finally: loading을 false로 설정
            setLoading(false);
        }
    };

    const handleLocationChange = () => {
        const loc = prompt('위치를 입력하세요.');
        if(loc) setLocation(loc);
    }

    // <img class="upload-user-avatar" src="default-avatar.png">
    // user.userAvatar로 가져 온 이미지가 엑스박스 일 때
    const defaultImage = '/static/img/default-avatar.jpg';
    const avatarImage = user.userAvatar && user.userAvatar.trim() !== '' ?
        user.userAvatar : defaultImage;

    /**
     * 이미지 오류 시 기본 이미지로 변경
     */
    const handleAvatarError = (e) => {
        e.target.src = defaultImage;
    }

    return (
        <div className="upload-container">
            {/* 헤더 */}
            <Header type="upload"
                    title="새 게시물"
                    onSubmit={handlePost}
                    submitDisabled={!selectedImage || !caption.trim()}
                    loading={loading}
                    submitText={"공유"}
            />

            <div className="upload-content">
                <div className="upload-card">
                    {/* 이미지 업로드 영역 작성 */}
                    <div className="upload-image-area">
                        {/* imagePreview가 있으면 이미지 표시, 없으면 업로드 UI 표시 */}
                        {/* FileReader로 변환한 base64 이미지를 img src에 사용 */}
                        {/* input type="file" accept="image/*" onChange={handleImageChange} */}
                        {imagePreview ? (
                            <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
                                <img
                                    src={imagePreview}
                                    className="upload-preview-image"
                                    style={{filter: selectedFilter}}
                                />
                                <div className="filter-scroll-container">
                                    {FILTER_OPTIONS.map((option) => (
                                        <div key={option.name}
                                             className={`filter-item 
                                            ${selectedFilter === option.filter ?'active':''}  `}
                                             onClick={() => setSelectedFilter(option.filter)}
                                        >
                                            <span className="filter-name">{option.name}</span>
                                            <div className="filter-thumnail"
                                                 style={{
                                                     backgroundImage:`url(${imagePreview})`,
                                                     filter: option.filter,
                                                 }}
                                            >

                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <label className="upload-change-btn">
                                    이미지 변경
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="upload-file-input"
                                    />
                                </label>
                            </div>
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

                    {/* 캡션 입력 영역 작성 */}
                    <div className="upload-caption-area">
                        <div className="upload-caption-content">
                            {/* 프로필 이미지 표시 */}
                            <img className="upload-user-avatar"
                                   src={avatarImage}
                                   onError={handleAvatarError}
                            />

                            <div className="upload-caption-right">
                                {/* 사용자명 표시 */}
                                <div className="upload-username">
                                    {user.userName}
                                </div>

                                {/*
                                    1. 기존 textarea 주석 처리
                                    2. <MentionInput /> 사용
                                    3. props 전달:
                                       - value={caption}
                                       - onChange={setCaption}
                                       - placeholder="문구를 입력하세요... (@로 사용자 태그)"
                                       - rows={4}
                                */}
                                {/*
                                <textarea placeholder="문구를 입력하세요."
                                          value={caption}
                                          onChange={(e) => setCaption(e.target.value)}
                                          rows={4}
                                          className="upload-caption-input"
                                />
                                */}
                                <MentionInput
                                    value={caption}
                                    onChange={setCaption}
                                    placeholder="문구를 입력하세요... (@로 사용자 태그)"
                                    rows={4}
                                />
                                {/* 글자 수 표시 (예: 0/2,200) */}
                                <div className="upload-caption-content">
                                    {caption.length}/2,200
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TODO : 추가 옵션 (위치 추가, 태그하기) */}
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

export default PostUploadPage;