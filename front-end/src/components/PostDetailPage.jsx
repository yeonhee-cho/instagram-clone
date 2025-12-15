import Header from "./Header";
import {getImageUrl} from "../service/commonService";
import {Bookmark, Heart, MessageCircle, Send} from "lucide-react";
import MentionText from "./MentionText";
import React, {useEffect, useState} from "react";
import apiService from "../service/apiService";
import {useNavigate, useParams} from "react-router-dom";
import PostOptionsMenu from "./PostOptionsMenu";

const PostDetailPage = () => {
    const {postId} = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("user") ||'[]');

    useEffect(() => {
        loadFeedData();
    }, []);


    const loadFeedData = async () => {
        setLoading(true);
        try {
            const postData = await apiService.getPost(postId);
            console.log('📌 postData', postData);
            setPost(postData);
        } catch (err) {
            console.error("❌ post 피드 불러오기 실패:", err);
            alert("post 피드를 불러오는 중 문제가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // toggleLike 함수
    const toggleLike = async (postId, isLiked) => {

        // 소비자의 눈에서 좋아요 취소를 보여주고, 백엔드 작업 시작
        // 1. 현재 게시물 목록 복사 (원본을 바로 건드리면 안 됨)
        const newPosts = [...post];

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
            setPost(newPosts);
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
            const postData = await apiService.getPosts();
            setPosts(postData);
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
            setPost(post.filter(p => p.postId !== postId));
            setSelectedPost(null);
            alert("게시물이 삭제되었습니다.");
        } catch(err) {
            alert("게시물 삭제에 실패했습니다.");
        }
    }

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

    if(!post) return null;

    return (
        <div className="feed-container">
            <Header/>

            <div className="feed-content">
                <article key={post.postId} className="post-card">
                    <div className="post-header">
                        <div className="post-user-info">
                            <img src={getImageUrl(post.userAvatar)}
                                 className="post-user-avatar"
                                 style={{cursor:'pointer'}}
                                 onClick={() => navigate(`/myfeed?userId=${post.userId}`)}
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

                    <img src={post.postImage}
                         className="post-image"
                         alt={`${post.userName}의 게시물 이미지`}
                    />
                    <div className="post-content">
                        <div className="post-actions">
                            <div className="post-actions-left">
                                <Heart className={`action-icon like-icon ${post.isLiked ? 'liked' : ''}`}
                                       onClick={() => toggleLike(post.postId, post.isLiked)}
                                       fill={post.isLiked ? "#ed4956" : "none"}
                                />
                                <MessageCircle className="action-icon" onClick={handleShare}/>
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
                            <button className="post-comments-btn">
                                댓글{post.commentCount}개 모두 보기
                            </button>
                        )}
                        <div className="post-time">
                            {post.createdAt ||'방금 전'}
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}

export default PostDetailPage;