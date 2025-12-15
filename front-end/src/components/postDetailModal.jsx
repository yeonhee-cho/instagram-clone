
import React from 'react';
import { X, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { getImageUrl } from '../service/commonService';
import MentionText from './MentionText';
import PostOptionsMenu from "./PostOptionsMenu";

const PostDetailModal = ({ post, currentUserId, onClose, onDelete, onToggleLike }) => {

    // ============================================
    // post가 없으면 null 반환하기
    // ============================================
    if(!post) return null;

    // ============================================
    // 링크 공유 함수 구현
    // ============================================
    const handleShare = async () => {
        // 공유할 URL 만들기
        const shareUrl = `${window.location.origin}/post/${post.postId}`;


        // Web Share API 지원 여부 확인
        if (navigator.share) {
            try {
                // 공유하기
                await navigator.share({
                    title: `${post.userName}의 게시물`,// 제목 작성
                    text: post.postCaption, // 게시물 캡션
                    url: shareUrl // URL
                });
            } catch (err) {
                // 에러 처리 (AbortError 제외)
                if (err.name !== 'AbortError') {
                    copyToClipboard(shareUrl);
                }
            }
        } else {
           // Web Share API 미지원 시 클립보드 복사
            copyToClipboard(shareUrl);
        }
    };

    // ============================================
    // 클립보드 복사 함수 구현
    // ============================================
    const copyToClipboard = (text) => {
        // navigator.clipboard.writeText() 사용
        navigator.clipboard.writeText(text).then(() => {
            // 성공: "링크가 클립보드에 복사되었습니다!" 알림
            alert("링크가 클립보드에 복사되었습니다!");
        }).catch(() => {
            // 실패: "링크 복사에 실패했습니다." 알림
            alert("링크 복사에 실패했습니다.");
        })
    };

    return (
        // ============================================
        // 모달 오버레이 (배경)
        // ============================================
        <div className="post-detail-overlay" onClick={onClose}>

            {/* ============================================
              모달 컨테이너
              - className: post-detail-container
              - 클릭 시 이벤트 버블링 방지
              ============================================ */}
            <div className="post-detail-container"
                 onClick={(e) => e.stopPropagation()}
            >

                {/* 닫기 버튼 */}
                <button className="post-detail-close" onClick={onClose}>
                    {/* X 아이콘 (size=24) */}
                    <X size={24}/>
                </button>

                <div className="post-detail-content">

                    {/* ============================================
                      이미지 섹션
                      ============================================ */}
                    <div className="post-detail-image-section">
                        {/* 게시물 이미지 표시 */}
                        <img className="post-detail-image" src={post.postImage} alt={`${post.userName}의 게시물 이미지`}/>

                    </div>

                    {/* ============================================
                      정보 섹션
                      ============================================ */}
                    <div className="post-detail-info-section">

                        {/* 헤더 (사용자 정보) */}
                        <div className="post-detail-header">
                            <div className="post-user-info">
                                {/* 프로필 이미지 */}
                                <img className="post-user-avatar"
                                     src={getImageUrl(post.userAvatar)}
                                     alt={`${post.userName} 프로필 이미지`}
                                />


                                {/* 사용자 이름 */}
                                <span className="post-username">{post.userName}</span>


                            </div>

                            {/* PostOptionsMenu 컴포넌트 */}
                            {/* props: post, currentUserId, onDelete */}
                            <PostOptionsMenu
                                post={post}
                                currentUserId={currentUserId}
                                onDelete={onDelete}
                            />
                        </div>

                        {/* 캡션 섹션 */}
                        <div className="post-detail-caption-section">
                            <div className="post-caption">
                                {/* 사용자 이름 (굵게) */}
                                <span className="post-caption-username">{post.userName}</span>

                                {/* MentionText 컴포넌트로 캡션 표시 */}
                                {/* props: text={post.postCaption} */}
                                <MentionText text={post.postCaption}/>

                            </div>
                        </div>

                        {/* 액션 버튼들 */}
                        <div className="post-detail-actions">
                            <div className="post-actions">
                                <div className="post-actions-left">

                                    {/* 좋아요 버튼 (Heart 아이콘) */}
                                    <Heart className={`action-icon like-icon ${post.isLiked ? 'liked' : ''}`}
                                           onClick={() => onToggleLike(post.postId, post.isLiked)}
                                           fill={post.isLiked ? "#ed4956" : "none"}
                                    />
                                    {/* 공유 버튼 (MessageCircle 아이콘) */}
                                    <MessageCircle className="action-icon" onClick={handleShare}/>

                                    {/* 전송 버튼 (Send 아이콘) */}
                                    <Send className="action-icon"/>

                                </div>

                                {/* 북마크 버튼 (Bookmark 아이콘) */}
                                <Bookmark className="action-icon"/>

                            </div>

                            {/* 좋아요 개수 */}
                            <div className="post-likes">
                                좋아요 ${post.likeCount}개

                            </div>

                            {/* 게시 시간 */}
                            <div className="post-time">
                                {post.createdAt || '방금 전'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;