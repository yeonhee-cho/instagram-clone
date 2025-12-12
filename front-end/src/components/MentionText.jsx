import React from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';

const MentionText = ({ text, className = '' }) => {
    const navigate = useNavigate();

    // 멘션 파싱 함수 구현
    const parseMentions = (text) => {
        // 1. text가 없으면 빈 배열 반환
        if (!text) return [];
        // 2. 정규표현식 /@(\w+)/g 를 사용하여 @유저네임 패턴 찾기
        // const mentionRegex = /@(\w+)/g; // w 영어, + 단어를 쓴다
        const mentionRegex = /@([가-힣\w]+)/g;

        // 3. parts 배열에 { type: 'text', content: '...' } 또는
        const parts = [];
        let lastIndex = 0;
        let match;

        // 4. while 루프와 regex.exec() 사용
        while ((match = mentionRegex.exec(text)) !== null) {
            // @ 이전에 일반 텍스트
            if(match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: text.substring(lastIndex, match.index),
                });
            }

            // 5. 마지막 남은 텍스트도 parts에 추가
            // { type: 'mention', content: '@username', username: 'username' } 형태로 저장
            // 멘션 부분
            parts.push({
                type: 'mention',
                content: match[0], // @username
                username: match[1], // username
            });
            lastIndex = match.index + match[0].length;
        }

        // 멘션 이후 남은 텍스트들은 기본 텍스트형태 유지
        if(lastIndex < text.length) {
            parts.push({
                type: 'text',
                content:text.substring(lastIndex)
            });
        }
        return parts;
    };

    // 멘션 클릭 핸들러 구현
    const handleMentionClick = async (username, e) => {
        // 1. e.preventDefault()와 e.stopPropagation() 호출
        e.preventDefault();
        e.stopPropagation();
        try {
            // 2. apiService.getUserByUsername(username) 호출
            const u = await apiService.getUserByUsername(username);
            console.log("멘션 클릭 핸들러 구현 u", u);
            // 3. user가 존재하고 userId가 있으면 navigate로 이동
            //    `/myfeed?userId=${user.userId}` 또는 적절한 경로
            if(u && u.userId) {
                navigate(`/myfeed?userId=${u.userId}`);
            }
        } catch (err) {
            // 4. 에러 발생 시 콘솔에 로그 출력
            console.err("❌ 유저 찾기 실패 : ", err);
        }
    };

    const parts = parseMentions(text);

    return (
        <span className={className}>
            {parts.map((part, index) => {
                if (part.type === 'mention') {
                    return (
                        <span
                            key={index}
                            className="mention-link"
                            onClick={(e) => handleMentionClick(part.username, e)}
                            style={{
                                color: '#0095f6',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            {part.content}
                        </span>
                    );
                }
                return <span key={index}>{part.content}</span>;
            })}
        </span>
    );
};

export default MentionText;