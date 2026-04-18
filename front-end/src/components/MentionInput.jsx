import React, { useState, useRef, useEffect } from 'react';
import apiService from '../service/apiService';
import {getImageUrl} from "../service/commonService";
import mentionText from "./MentionText";

const MentionInput = ({ value, onChange, placeholder, rows = 4 }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [cursorPosition, setCursorPosition] = useState(0);
    const textareaRef = useRef(null);
    const suggestionsRef = useRef(null);
    const highlightRef = useRef(null);

    // 유저 검색 함수 구현
    const searchUsers = async (query) => {
        console.log("🔍 검색 시작 : ", query);
        // 1. query가 없거나 길이가 1 미만이면 suggestions를 빈 배열로 설정하고 종료
        if(!query || query.lenth < 1) {
            console.log("🔍 쿼리가 비어있어요.");
            setSuggestions([]);
            return;
        }
       try {
           // 2. apiService.searchUsers(query) 호출
           const res = await apiService.searchUsers(query);
           // 3. 결과를 suggestions state에 저장
           setSuggestions(res || []);
       } catch (err) {
            // 4. 에러 발생 시 콘솔에 로그 출력 후 suggestions를 빈 배열로 설정
           console.log("❌ 사용자 검색 실패 : ", err);
           setSuggestions([]);
       }
    };

    // 텍스트 변경 처리 함수 구현
    const handleTextChange = (e) => {
        const newValue = e.target.value;
        const newCursorPosition = e.target.selectionStart;

        // 부모 컴포넌트로 값 전달
        onChange(newValue);
        setCursorPosition(newCursorPosition);

        // @ 이후 텍스트 추출 로직 구현
        // 1. 커서 이전의 텍스트 추출 (substring 사용)
        const textBeforeCursor = newValue.substring(0, newCursorPosition);

        // 2. 마지막 '@' 위치 찾기 (lastIndexOf 사용)
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');

        if(lastAtIndex !== -1){
            const textAfterAt  = textBeforeCursor.substring(lastAtIndex + 1);

            // 3. '@' 이후의 텍스트가 공백이나 줄바꿈을 포함하지 않으면:
            if(!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
                //    - setShowSuggestions(true)
                //    - searchUsers 호출
                //    - setSelectedIndex(0)
                setShowSuggestions(true);
                searchUsers(textAfterAt);
                setSelectedIndex(0);

            } else {
                // 4. 그렇지 않으면 setShowSuggestions(false)
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
        }

    };

    // 유저 선택 함수 구현
    const selectUser = (user) => {
        console.log("유저 선택 user 확인 : ", user);
        // 1. 커서 이전/이후 텍스트 추출
        const textBeforeCursor = value.substring(0, cursorPosition);
        console.log("커서 이전 텍스트 : ", textBeforeCursor);
        const textAfterCursor = value.substring(cursorPosition);
        console.log("커서 이후 텍스트 : ", textAfterCursor);

        // 2. 마지막 '@' 위치 찾기
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');
        console.log("마지막 '@' 위치 : ", lastAtIndex);

        // 3. '@' 이전 텍스트 + '@유저네임 ' + 커서 이후 텍스트 합치기
        if(lastAtIndex !== -1) {
            const beforeAt = textBeforeCursor.substring(0, lastAtIndex);
            console.log("'@' 이전 텍스트 : ", beforeAt);
            const newValue = `${beforeAt}@${user.userName} ${textAfterCursor}`;
            console.log("합친 내용 : ", newValue);
            const newCursorPos = beforeAt.length + user.userName.length + 2;
            console.log("커서 이후 텍스트 : ", newCursorPos);
            // 4. onChange로 새로운 값 전달`
            onChange(newValue);

            // 5. setShowSuggestions(false), setSuggestions([])
            setShowSuggestions(false);
            setSuggestions([]);

            // 6. setTimeout으로 textarea에 포커스하고 커서 위치 조정`
            setTimeout(() => {
                if(textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
                }
            })
        }
    };

    // 키보드 이벤트 처리 함수 구현
    const handleKeyDown = (e) => {
        // 1. showSuggestions가 false이거나 suggestions가 비어있으면 종료
        if (!showSuggestions || suggestions.length === 0) return;

        // 2. ArrowDown: selectedIndex 증가 (마지막이면 0으로)
        // 3. ArrowUp: selectedIndex 감소 (0이면 마지막으로)
        // 4. Enter: 현재 선택된 유저로 selectUser 호출
        // 5. Escape: setShowSuggestions(false)
        // 6. 각 케이스에서 e.preventDefault() 호출
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                // setSuggestions((prev) => prev < suggestions.length - 1 ? prev + 1 : 0);
                setSelectedIndex((prev) => prev < suggestions.length - 1 ? prev + 1 : 0);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => prev > 0 ? prev - 1 : suggestions.length - 1);
                break;
            case 'Enter':
                if(showSuggestions && suggestions[selectedIndex]) {
                    // 해당 유저가 있는지 확인하는 조건 추가
                    e.preventDefault();
                    selectUser(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowSuggestions(false);
                break;
            default:
                break;
        }
    };

    // 외부 클릭 감지 useEffect 구현
    useEffect(() => {
        // 1. handleClickOutside 함수 생성
        const handleClickOutside = (e) => {
            // 2. suggestionsRef.current 외부 클릭 시 setShowSuggestions(false)
            if(suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        }
        // 3. document에 mousedown 이벤트 리스너 등록
        document.addEventListener('mousedown', handleClickOutside);
        // 4. cleanup 함수에서 이벤트 리스너 제거
        return() => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // commend -> 이동 예정
    const highlightMentions = (text) => {
        // console.log("textarea 전체 텍스트 : ", text);
        // const mentionRegex = /@(\w+)/g; // 영문 정규식
        const mentionRegex = /@([가-힣\w]+)/g; // 영어 한국어
        // const mentionRegex = /@([\p{L}\p{N}_]+)/gu; // 전세계 모든 유니코드 문자
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = mentionRegex.exec(text)) !== null) {
            if(match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            parts.push(
                <span key={match.index} style={{color: '#0095f6', fontWeight: '600'}}>
                    {match[0]}
                </span>
            )
            lastIndex = match.index + match[0].length;
        }
        if(lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }
        return parts;
    }

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <div ref={highlightRef}
                 className="upload-caption-input"
                 style={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     right: 0,
                     bottom: 0,
                     color: 'transparent',
                     pointerEvents: 'none',
                     whiteSpace:'pre-wrap',
                     overflow:'hidden',
                     background:'transparent',
                     border:'1px solid transparent'
                 }}
            >
                <span style={{color:'#000'}}>{highlightMentions(value)}</span>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={rows}
                className="upload-caption-input"
                style={{
                    position: 'relative',
                    background: 'transparent',
                    color:'transparent',
                    caretColor:'#000'
                }}
            />

            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="mention-suggestions"
                >
                    {suggestions.map((user, index) => (
                        <div
                            key={user.userId}
                            className={`mention-item ${index === selectedIndex ? 'selected' : ''}`}
                            onClick={() => selectUser(user)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <img
                                src={getImageUrl(user.userAvatar)}
                                alt={user.userName}
                                className="mention-avatar"
                            />
                            <div className="mention-info">
                                <div className="mention-username">{user.userName}</div>
                                {user.userFullname && (
                                    <div className="mention-fullname">{user.userFullname}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MentionInput;