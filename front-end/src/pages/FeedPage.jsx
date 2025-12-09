// ============================================
// src/pages/FeedPage.jsx
// TODO: 피드 페이지 UI 및 기능 구현
// - posts, stories, loading state 선언
// - useEffect로 컴포넌트 마운트 시 데이터 로드
// - loadFeedData 함수: getPosts, getStories 호출
// - toggleLike 함수: addLike/removeLike 호출 후 목록 새로고침
// - handleLogout 함수: 확인 후 로그아웃
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Home, PlusSquare, Film, User } from 'lucide-react';

const FeedPage = () => {
    // posts state 선언 (초기값: [])
    const [posts, setPosts] = useState([]);

    // stories state 선언 (초기값: [])
    const [stories, setStories] = useState([]);

    // loading state 선언 (초기값: true)
    const [loading, setLoading] = useState(false);

    // navigate 함수
    const navigate = useNavigate();

    // useEffect를 사용하여 컴포넌트 마운트 시 loadFeedData 호출
    useEffect(() => {
        loadFeedData();
    }, []);


    // loadFeedData 함수
    const loadFeedData = async () => {
        // 1. try-catch 사용
        try {
            // 2. apiService.getPosts()와 apiService.getStories()를 Promise.all로 동시 호출
            const postsData = await apiService.getPosts();
            const storiesData = await apiService.getStories();
            // const [postsData, storiesData] = await Promise.all([
            //     apiService.getPosts(),
            //     apiService.getStories()
            // ]);

            console.log('📌 postsData', postsData);
            console.log('📌 storiesData', storiesData);

            // 3. 받아온 데이터로 posts와 stories state 업데이트
            setPosts(postsData);
            setStories(storiesData);
        } catch (err) {
            // 4. catch: 에러 처리 (console.error, alert)
            console.error("❌ 피드 불러오기 실패:", err);
            alert("피드를 불러오는 중 문제가 발생했습니다.");
        } finally {
            // 5. finally: loading을 false로 설정
            setLoading(false);
        }

    };

    // TODO: toggleLike 함수를 작성하세요
    // 1. postId와 isLiked를 파라미터로 받음
    // 2. isLiked가 true면 removeLike, false면 addLike 호출
    // 3. 완료 후 getPosts()를 다시 호출하여 목록 새로고침
    // 4. catch: 에러 처리
    const toggleLike = async (postId, isLiked) => {
        // TODO: 함수를 완성하세요
    };

    // TODO: handleLogout 함수를 작성하세요
    // 1. window.confirm으로 로그아웃 확인
    // 2. 확인하면 apiService.logout() 호출
    const handleLogout = () => {
        // TODO: 함수를 완성하세요
    };

    // TODO: loading이 true면 "로딩 중..." 표시
    if (loading) {
        return (
            <div className="feed-container">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    로딩 중...
                </div>
            </div>
        );
    }

    const defaultImage = '/static/img/default-avatar.jpg';
    const handleAvatarError = (e) => {
        e.target.src = defaultImage;
    }

    return (
        <div className="feed-container">
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
                    </div>
                </div>
            </header>

            <div className="feed-content">
                {/* 스토리 섹션 작성 */}
                {/* stories 배열이 있을 때만 표시 */}
                {/* stories.map으로 각 스토리를 렌더링 */}
                {stories.length > 0 && (
                    <div className="stories-container">
                        <div className="stories-wrapper">
                            {stories.map((story => (
                                <div key={story.id} className="story-item">
                                    <div className="story-avatar-wrapper" key={story.id}>
                                        <img src={story.userAvatar}
                                             className="story-avatar"
                                             onError={handleAvatarError}
                                        />
                                    </div>
                                    <span className="story-username">{story.userName}</span>
                                </div>
                            )))}
                        </div>
                    </div>
                )}


                {posts.length > 0 && (
                    posts.map((post) => (
                        <article key={post.id} className="post-card">
                            <div className="post-header">
                                <div className="post-user-info">
                                    <img src={post.userAvatar}
                                         className="post-user-avatar"
                                         onError={handleAvatarError}
                                    />
                                    <span className="post-username">{post.userName}</span>
                                </div>
                                <MoreHorizontal className="post-more-icon" />
                            </div>

                            <img src={post.postImage} className="post-image" />
                            <div className="post-content">
                                <div className="post-actions">
                                    <div className="post-actions-left">
                                        <Heart
                                            className={`action-icon like-icon ${post.isLiked ? 'liked' : ''}`}
                                            onClick={() => toggleLike(post.postId, post.isLiked)}
                                            fill={post.isLiked ? "#ed4956" : "none"}
                                        />
                                        <MessageCircle className="action-icon" />
                                        <Send className="action-icon" />
                                    </div>
                                    <Bookmark className="action-icon" />
                                </div>

                                <div className="post-likes">
                                    좋아요 {post.likeCount}개
                                </div>

                                <div className="post-caption">
                                    <span className="post-caption-username">{post.userName}</span>
                                    {post.postCaption}
                                </div>
                                {post.commentCount > 0 && (
                                    <button className="post-comments-btn">
                                        댓글{post.commentCount}개 모두 보기
                                    </button>
                                )}
                                <div className="post-time">
                                    {post.createdAt ||'방금 전'}
                                </div>
                            </div>
                        </article>
                    ))
                )}
                {/* TODO: 게시물이 없을 때 메시지 표시 */}
            </div>
        </div>
    );
};

export default FeedPage;
