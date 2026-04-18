// ============================================
// src/pages/FeedPage.jsx
// 피드 페이지 UI 및 기능 구현
// - posts, stories, loading state 선언
// - useEffect로 컴포넌트 마운트 시 데이터 로드
// - loadFeedData 함수: getPosts, getStories 호출
// - toggleLike 함수: addLike/removeLike 호출 후 목록 새로고침
// - handleLogout 함수: 확인 후 로그아웃
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import Header from "../components/Header";
import {getImageUrl} from "../service/commonService";
import MentionText from "../components/MentionText";
import PostOptionsMenu from "../components/PostOptionsMenu";

/*
피드 페이지에서 Heart 를 클릭하면 좋아요 수 증가
*/
const FeedPage = () => {
    // posts state 선언 (초기값: [])
    const [posts, setPosts] = useState([]);

    // stories state 선언 (초기값: [])
    const [stories, setStories] = useState([]);

    // loading state 선언 (초기값: true)
    const [loading, setLoading] = useState(false);

    const [selectedPost, setSelectedPost] = useState(null);

    // navigate 함수
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("user") ||[]);

    // useEffect를 사용하여 컴포넌트 마운트 시 loadFeedData 호출
    useEffect(() => {
        loadFeedData();
    }, []);


    // loadFeedData 함수
    const loadFeedData = async () => {
        /*
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
        */
        setLoading(true);
        try {
            const postsData = await apiService.getPosts();
            console.log('📌 postsData', postsData);
            setPosts(postsData);
        } catch (err) {
            console.error("❌ post 피드 불러오기 실패:", err);
            alert("post 피드를 불러오는 중 문제가 발생했습니다.");
        } finally {
            setLoading(false);
        }

        try {
            const storiesData = await apiService.getStories();
            console.log('📌 storiesData', storiesData);
            // 사용자 별로 그룹화 시켜주기
            const gu = groupStoriesByUser(storiesData);
            setStories(gu);
        } catch (err) {
            console.error("❌ stories 피드 불러오기 실패:", err);
            alert("stories 피드를 불러오는 중 문제가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 사용자 별로 스토리를 그룹화하고 가장 최근 스토리만 반환
    // select * from stories 에서 가져 온 모든 데이터를 storiesData 변수에 전달
    const groupStoriesByUser = (storiesData) => {
        const userStoriesMap = {}; // 추후 유저들을 그룹화해서 담을 변수 공간
        // db에서 가져온 모든 스토리를 for 문으로 순회
        storiesData.forEach(story => {
            const userId = story.userId; // 각 스토리에 해당하는 유저 아이디를 변수이름에 담아
            // 해당 사용자의 첫 스토리이거나, 더 최근 스토리인 경우 스토리 유저 나열 순서를 맨 앞으로 이동
            // 정렬 = 알고리즘
            if (!userStoriesMap[userId]
                ||
                new Date(story.createdAt) > new Date(userStoriesMap[userId].createdAt)
            ) {
                userStoriesMap[userId] = story;
            }
        });
        // 위에서 그룹화한 userStoriesMap 유저들을 배열로 변환하고 최신순으로 정렬
        // 정렬 = 알고리즘
        return Object.values(userStoriesMap).sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    // toggleLike 함수를 작성하세요
    // 1. postId와 isLiked를 파라미터로 받음
    const toggleLike = async (postId, isLiked) => {

        // 소비자의 눈에서 좋아요 취소를 보여주고, 백엔드 작업 시작
        // 1. 현재 게시물 목록 복사 (원본을 바로 건드리면 안 됨)
        const newPosts = [...posts];

        // 2. 내가 클릭한 게시물이 몇 번째에 있는지 찾기
        const targetIndex = newPosts.findIndex(post => post.postId === postId);

        // 게시물을 찾았다면
        if(targetIndex !== -1) {
            // 좋아요 상태를 반대로 뒤집기(true -> false)
            newPosts[targetIndex].isLiked = !isLiked;

            // 숫자 취소 -1 차감
            if(isLiked) newPosts[targetIndex].likeCount -= 1;
            
            // 숫자 추가 + 1 추가
            else newPosts[targetIndex].likeCount += 1;

            // 변경된 상태로 화면 업그레이드
            setPosts(newPosts);
        }

        try{
            // 2. isLiked가 true면 removeLike, false면 addLike 호출
            // 좋아요 누르고 취소가 되지만 백그라운드에서 작업한 내용이 바로 보이는 상황이 아님
            if(isLiked) {
                await apiService.removeLike(postId);
            } else {
                await apiService.addLike(postId);
            }
            // 3. 완료 후 getPosts()를 다시 호출하여 목록 새로고침
            /* NOTE
            기존에는 백엔드 -> 프론트엔드 변경했다면
            수정내용은 프론트엔드 -> 백엔드 로직
            const postsData = await apiService.getPosts();
            setPosts(postsData);
             */
        } catch (e) {
            // 4. catch: 에러 처리
            alert("좋아요 처리에 실패했습니다.");
            loadFeedData(); // 다시 원래대로 돌려놓기
        }

    };

    const deletePost = async (postId) => {
        try {
            await apiService.deletePost(postId);
            setPosts(posts.filter(p => p.postId !== postId));
            setSelectedPost(null);
            alert("게시물이 삭제되었습니다.");
        } catch(err) {
            alert("게시물 삭제에 실패했습니다.");
            console.error(err);
        }
    }

    // loading이 true면 "로딩 중..." 표시
    if (loading) {
        return (
            <div className="feed-container">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    로딩 중...
                </div>
            </div>
        );
    }

    return (
        <div className="feed-container">
            <Header/>

            <div className="feed-content">
                {/* 스토리 섹션 작성 */}
                {/* stories 배열이 있을 때만 표시 */}
                {/* stories.map으로 각 스토리를 렌더링 */}
                {stories.length > 0 && (
                    <div className="stories-container">
                        <div className="stories-wrapper">
                            {stories.map((story) => (
                                <div key={story.userId}
                                     className="story-item"
                                     onClick={() => navigate(`/story/detail/${story.userId}`)}
                                >
                                    <div className="story-avatar-wrapper"
                                         key={story.id}
                                    >
                                        <img src={getImageUrl(story.userAvatar)}
                                             className="story-avatar"
                                             alt={`${story.userName}`}
                                        />
                                    </div>
                                    <span className="story-username">
                                        {story.userName}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {posts.length > 0 && (
                    posts.map((post) => (
                        <article key={post.postId} className="post-card">
                            <div className="post-header">
                                <div className="post-user-info">
                                    <img src={getImageUrl(post.userAvatar)}
                                         className="post-user-avatar"
                                         style={{cursor: 'pointer'}}
                                         o onClick={post.userId === currentUser.userId
                                        ? () => navigate('/myfeed')
                                        :() => navigate(`/myfeed?userId=${post.userId}`)}
                                         alt={`${post.userName}`}
                                    />
                                    <p style={{display:'flex', flexDirection: 'column'}}>
                                        <span className="post-username">{post.userName}</span>
                                        <span className="post-location">{post.postLocation}</span>
                                    </p>
                                </div>
                                <PostOptionsMenu
                                    post={post}
                                    currentUserId={currentUser.userId}
                                    onDelete={deletePost}
                                />
                            </div>

                            {/*
                            모달로 디테일 띄우기
                            <img src={post.postImage}
                                 className="post-image"
                                 onClick={() => setSelectedPost(post)}
                                 style={{cursor : 'pointer'}}
                                 alt={`${post.userName}의 게시물 이미지`}
                            />
                            */}

                            <img src={post.postImage}
                                 className="post-image"
                                 onClick={() => navigate(`/post/${post.postId}`)}
                                 style={{cursor : 'pointer'}}
                                 alt={`${post.userName}의 게시물 이미지`}
                            />
                            <div className="post-content">
                                <div className="post-actions">
                                    <div className="post-actions-left">
                                        <Heart
                                            className={`action-icon like-icon ${post.isLiked ? 'liked' : ''}`}
                                            onClick={() => toggleLike(post.postId, post.isLiked)}
                                            fill={post.isLiked ? "#ed4956" : "none"}
                                        />
                                        <MessageCircle className="action-icon"
                                                       onClick={() => navigate(`/post/${post.postId}`)}
                                        />
                                        <Send className="action-icon" />
                                    </div>
                                    <Bookmark className="action-icon" />
                                </div>

                                <div className="post-likes">
                                    좋아요 {post.likeCount}개
                                </div>

                                <div className="post-caption">
                                    <span className="post-caption-username">{post.userName}</span>

                                    {/* MentionText */}
                                    <MentionText text={post.postCaption}/>
                                </div>

                                {post.commentCount > 0 && (
                                    <button className="post-comments-btn"
                                            onClick={() => navigate(`/post/${post.postId}`)}
                                    >
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

            {/*
            {selectedPost && (
                <PostDetailModal
                    post={selectedPost}
                    currentUserId={currentUser.userId}
                    onClose={() => setSelectedPost(null)}
                    onDelete={deletePost}
                    onToggleLike={toggleLike}
                />
            )}
            */}
        </div>
    );
};

export default FeedPage;
