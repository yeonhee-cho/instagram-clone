import {ArrowLeft, Film, Home, MessageCircle, PlusSquare, Settings, User} from "lucide-react";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import apiService from "../service/apiService";

const Header = ({
    type="feed",
    title="",
    onSubmit = null,
    submitDisabled = false,
    submitText = '공유',
    loading = false
    }) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        if(window.confirm("로그아웃하시겠습니까?")) apiService.logout();
    }

    if(type === 'feed') {
        return(
            <header className="header">
                <div className="header-container">
                    <h1 className="header-title">Instagram</h1>
                    <div className="header-nav">
                        <Home className="header-icon"
                              onClick={() => navigate(('/'))}/>
                        <MessageCircle className="header-icon"/>
                        <PlusSquare className="header-icon"
                                    onClick={() => navigate(('/upload'))}/>
                        {/* 아이콘 클릭하면 스토리 업로드로 이동 설정 */}
                        <Film className="header-icon" onClick={() => navigate("/story/upload")}/>
                        <User className="header-icon" onClick={handleLogout}/>
                        <Settings size={20} className="profile-settings-icon" />
                    </div>
                </div>
            </header>
        )
    }

    if(type === 'upload') {
        return (
            <header className="upload-header">
                <div className="upload-header-content">
                    {/* 뒤로가기 버튼 */}
                    {/* ArrowLeft 아이콘 사용, onClick: navigate('/feed') */}
                    <button className="upload-back-btn"
                        /* /feed로 이동 */
                            onClick={() => navigate("/feed")}
                    >
                        {/* ArrowLeft 아이콘 추가 (size={24}) */}
                        <ArrowLeft size={24}/>
                    </button>

                    <h2 className="upload-title">새 게시물</h2>

                    {/* 공유 버튼 (onClick: handlePost, disabled: loading) */}
                    <button className="upload-submit-btn"
                            onClick={onSubmit}
                            disabled={submitDisabled || loading}
                            style={{opacity : (submitDisabled || loading) ? 0.5 : 1}}
                    >
                        {loading ? '업로드 중...' : submitText}
                    </button>
                </div>
            </header>
        )
    }
}

export default Header;

// <header className="upload-header">
//     <div className="upload-header-content">
//         {/* 뒤로가기 버튼 */}
//         {/* ArrowLeft 아이콘 사용, onClick: navigate('/feed') */}
//         <button className="upload-back-btn"
//             /* /feed로 이동 */
//                 onClick={() => navigate("/feed")}
//         >
//             {/* ArrowLeft 아이콘 추가 (size={24}) */}
//             <ArrowLeft size={24}/>
//         </button>
//
//         {/* 제목 작성 */}
//         <h2 className="upload-title">새 스토리</h2>
//
//         {/* 공유 버튼 작성 */}
//         {/* onClick: handlePost */}
//         {/* disabled: loading || !selectedImage */}
//         {/* style: opacity를 조건부로 설정 (이미지 없거나 로딩중이면 0.5, 아니면 1) */}
//         {/* 버튼 텍스트: loading이면 "업로드 중...", 아니면 "공유" */}
//         <button
//             className="upload-submit-btn"
//             onClick={handlePost}
//             disabled={loading || !selectedImage}
//             style={{opacity: loading || !selectedImage}}
//         >
//             {loading ? '업로드 중...' : '공유'}
//         </button>
//     </div>
// </header>