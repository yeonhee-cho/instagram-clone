import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {X, MoreHorizontal, Heart, Send, ChevronLeft, ChevronRight} from 'lucide-react';
import apiService, {API_BASE_URL} from "../service/apiService";
import {formatDate, getImageUrl} from "../service/commonService";

/**
 * commonService 에 현재 날짜를 몇 시간 전에 업로드했는지 formatDate 메서드 사용하여 날짜 변환
 * <span className="story-time">
 *     {storyData.createdAt}
 * </span>
 *
 * formatDate 형태로 1시간 1분전 업로드 형태 수정
 * 또는
 * formatDate 형태로 yyyy-mm-dd 형태로 확인 수정
 */
/*
Story 의 경우 상대방의 스토리를 다른 유저가 선택해서 보는 것이 아니라
유저가 올린 스토리를 오래된 순서부터 하나씩 보여짐
어떤 스토리와 스토리가 얼만큼 있는지 유저 프로필을 클릭하지 않으면 알 수 없다.
*/
const StoryDetailPage = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const {userId} = useParams();

    // List -> {}
    const [stories, setStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user')); // 현재 아이디 확인

    // userId -> storyId
    useEffect(() => {
        loadStoryData();
    }, [userId]);

    const loadStoryData = async () => {
        try {
            setLoading(true);
            const data = await apiService.getStory(userId);
            console.log("📌 data", data);

            // 데이터가 배열이거나 한 개 이상일 때
            if(Array.isArray(data) && data.length > 0) {
                setStories(data);
            } else {
                navigate('/feed');
            }
            setStories(data);
        } catch (err) {
            console.log("err",err);
            alert("스토리를 불러오는데 실패했습니다.");
            navigate("/feed")
        } finally {
            setLoading(false);
        }
    }

    // 다음 스토리로 이동
    const goToNextStory = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setProgress(0);
        } else {
            // 마지막 스토리면 창 닫고 피드로 이동 -> 다음 유저 스토리 보기
            navigate("/feed");
        }
    }

    // 이전 스토리로 이동 현재 번호에서 -1씩 감소
    const goToPrevStory = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setProgress(0); // 다음 게시물로 넘어가거나 이전 게시물로 넘어가면 프로그래스 바 처음부터 시작!
        } else {
            navigate("/feed");
        }
    }

    useEffect(() => {

        if(!stories) return;

        const duration = 5000;
        const intervalTime = 50;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    goToNextStory(); // 다음 스토리로 넘어가기
                    return 0; // 다음 스토리로 넘어갈 때 프로그래스바를 처음부터 다시 시작
                }
                return prev + (100 / (duration / intervalTime));
            });
        }, intervalTime);

        return () => clearInterval(timer);


        // 현재 바라보고 있는 페이지 번호가 변경되거나, 배열이 추가 될 때 감지
    }, [currentIndex, stories]);

    // 화면 클릭으로 이전 / 다음 이동
    /*
    화면 전체 너비 screenWidth 300

    왼쪽 3분의 1 구간
    0 ~ 100
    0 ~ screenWidth/3

    가운데
    100 ~ 200
    screenWidth/3  ~  screenWidth/3*2

    오른쪽
    200 ~ 300
    screenWidth/3*2  ~  screenWidth
    */
    const handleScreenClick = (e) => {
        // 위쪽 아래쪽 클릭의 경우 상하 y좌표 기준으로 클릭
        // 왼쪽 오른쪽 클릭의 경우 좌우 x좌표 기준으로 클릭
        const clickX = e.clientX;
        // 보통 3배율로 해서 왼쪽 이전, 오른쪽 다음
        // 그 3배율을 나눠주기 위해!! 작업
        const screenWidth = window.innerWidth;

        if(clickX < screenWidth/3) {
            // x좌표 기준으로 왼쪽 3분의 1 정도의 가로를 클릭하면 -> 이전 페이지
            goToPrevStory();
        } else if(clickX > (screenWidth/3)*2) {
            // 오른쪽에서부터 3분의 1 지점 클릭하면 -> 다음 페이지
            goToNextStory();
        }
    }

    if(loading) return <div>로딩중..</div>; // 콘솔 데이터 찍힘

    // 현재 스토리에 따른 유저정보와 스토리 아이디
    const currentStory = stories[currentIndex];
    // console.log("currentStory", currentStory);

    const handleDeleteStory = async () => {
        try {
            // deleteStory 에 현재 스토리 스토리 아이디 전달하여 스토리 삭제 sel delete 처리하기
            await apiService.deleteStory(currentStory.storyId);
            // controller deleteStory

            // 삭제 후 스토리 목록에서 제거
            const updateStories = stories.filter((_, index) => index !== currentIndex);
            // 스토리 없을 경우
            if(updateStories.length === 0){
                // 마지막 스토리를 삭제한 경우 피드로 이동
                navigate('/feed');
            } else {
                if (currentIndex >= updateStories.length) {
                    setCurrentIndex(updateStories.length - 1);
                }
                setStories(updateStories);
                setProgress(0);
            }
            setShowDeleteModal(false);
        } catch (err) {
            alert("스토리 삭제에 실패했습니다.");
            console.error(err.message);
        }
    }

    return (
        <div className="story-viewer-container" onClick={handleScreenClick}>
        {/* 스토리 전체 화면에서 클릭이 일어 날 수 있다. onClick={handleScreenClick} 추가 */}
            <div
                className="story-bg-blur"
                style={{backgroundImage: `url(${getImageUrl(currentStory.storyImage)})`}}
            />

            <div className="story-content-box">
                <div className="story-progress-wrapper">
                    {stories.map((_,index) => (
                        <div key={index} className="story-progress-bar">
                            <div className="story-progress-fill"
                                 style={{width:
                                         index < currentIndex ?
                                             '100%'
                                             :
                                             index === currentIndex ?
                                                 `${progress}%`
                                                 : '0%'
                                }}
                            >
                            </div>
                        </div>
                        )
                    )}
                </div>

                <div className="story-header-info">
                    <div className="story-user">
                        <img src={getImageUrl(currentStory.userAvatar)} alt="user"
                             className="story-user-avatar" />
                        <span className="story-username">
                            {currentStory.userName}
                        </span>
                        <span className="story-time">
                            {formatDate(currentStory.createdAt, 'relative')}
                        </span>
                    </div>
                    <div className="story-header-actions">
                        {/*본인일 때만 스토리 삭제 아이콘 보이기*/}
                        {/*아니 왜 똑같이 나오는데 userId는 못 쓰는가!!!!*/}
                        {
                            currentUser.userId === currentStory.userId ?
                            (
                                <MoreHorizontal color="white"
                                                className="story-icon"
                                                onClick={(e)=> {
                                                    e.stopPropagation();
                                                    setShowDeleteModal(true);
                                                }}
                                />
                            ) : ""
                        }

                        <X
                            color="white"
                            className="story-icon"
                            onClick={(e)=> {
                                e.stopPropagation();
                                navigate(-1);
                            }}
                        />
                    </div>
                </div>

                <img src={getImageUrl(currentStory.storyImage)}
                     alt="story"
                     className="story-main-image" />

                {currentIndex > 0 && (
                    <div className="story-nav-hint story-nev-left">
                        <ChevronLeft color="white" size={32} />
                    </div>
                )}

                {currentIndex > stories.length - 1 && (
                    <div className="story-nav-hint story-nev-right">
                        <ChevronRight color="white" size={32} />
                    </div>
                )}


                <div className="story-footer">
                    <div className="story-input-container">
                        <input
                            type="text"
                            placeholder="메시지 보내기..."
                            className="story-message-input"/>
                    </div>
                    <Heart color="white"
                           className="story-icon" />
                    <Send color="white"
                          className="story-icon" />
                </div>
            </div>
            {/* 모달 */}
            {showDeleteModal && (
                <div
                    className="story-delete-modal-overlay"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteModal(false);
                    }}
                >
                    <div
                        className="story-delete-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="story-delete-button story-delete-confirm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteStory();
                            }}
                        >
                            스토리 삭제
                        </button>
                        <button
                            className="story-delete-button story-delete-cancel"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteModal(false);
                            }}
                        >
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryDetailPage;