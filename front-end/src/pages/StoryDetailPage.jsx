import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { X, MoreHorizontal, Heart, Send } from 'lucide-react';
import apiService, {API_BASE_URL} from "../service/apiService";
import {getImageUrl} from "../service/commonService";

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
    const [storyData, setStoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // userId -> storyId
    useEffect(() => {
        loadStoryData();
    }, [userId]);

    const loadStoryData = async () => {
        try {
            setLoading(true);
            const data = await apiService.getStory(userId);
            console.log("📌 data", data)
            setStoryData(data);
        } catch (err) {
            console.log("err",err);
            alert("스토리를 불러오는데 실패했습니다.");
            navigate("/feed")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!storyData) return;
        const duration = 5000;
        const intervalTime = 50;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    navigate(-1);
                    return 100;
                }
                return prev + (100 / (duration / intervalTime));
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [navigate]);

    if(loading) return <div>로딩중..</div>; // 콘솔 데이터 찍힘

    return (
        <div className="story-viewer-container">
            <div
                className="story-bg-blur"
                style={{backgroundImage: `url(${getImageUrl(storyData.storyImage)})`}}
            />

            <div className="story-content-box">
                <div className="story-progress-wrapper">
                    <div className="story-progress-bar">
                        <div className="story-progress-fill"
                             style={{width: `${progress}%`}}></div>
                    </div>
                </div>

                <div className="story-header-info">
                    <div className="story-user">
                        <img src={getImageUrl(storyData.userImage)} alt="user"
                             className="story-user-avatar" />
                        <span className="story-username">
                            {storyData.userName}
                        </span>
                        <span className="story-time">
                            {storyData.createdAt}
                        </span>
                    </div>
                    <div className="story-header-actions">
                        <MoreHorizontal color="white"
                                        className="story-icon"/>
                        <X
                            color="white"
                            className="story-icon"
                            onClick={() => navigate(-1)}
                        />
                    </div>
                </div>

                <img src={getImageUrl(storyData.storyImage)}
                     alt="story"
                     className="story-main-image" />

                <div className="story-footer">
                    <div className="story-input-container">
                        <input
                            type="text"
                            placeholder="메시지 보내기..."
                            className="story-message-input"
                        />
                    </div>
                    <Heart color="white"
                           className="story-icon" />
                    <Send color="white"
                          className="story-icon" />
                </div>
            </div>
        </div>
    );
};

export default StoryDetailPage;