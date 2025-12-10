import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import apiService from '../service/apiService';
import {ArrowLeft, Image, X} from 'lucide-react';
import {getFilteredFile, FILTER_OPTIONS} from '../service/filterService';
import Header from "../components/Header";

const StoryUploadPage = () => {
    // selectedImage state 선언
    const [selectedImage, setSelectedImage] = useState(null);

    // imagePreview state 선언
    const [imagePreview, setImagePreview] = useState(null);

    // loading state 선언
    const [loading, setLoading] = useState(false);

    // 필터 값
    const [selectedFilter, setSelectedFilter] = useState('none');

    // navigate
    const navigate = useNavigate();

    // localStorage에서 user 정보 가져오기 (JSON.parse 사용)
    const user = JSON.parse(localStorage.getItem('user') || {});

    // handleImageChange 함수
    const handleImageChange = (e) => {
        // 1. e.target.files[0]으로 파일 가져오기
        const imageFile = e.target.files[0];
        // 2. 파일이 있으면:
        if (imageFile) {
            //    - selectedImage에 파일 저장
            setSelectedImage(imageFile);
            //    - FileReader를 생성하고 onloadend 이벤트 설정
            const reader = new FileReader();
            reader.onloadend = () => {
                //    - reader.result를 imagePreview에 저장
                setImagePreview(reader.result);
                //    - selectedFilter를 'none'으로 초기화
                setSelectedFilter('none');
            }
            //    - reader.readAsDataURL(file) 호출
            reader.readAsDataURL(imageFile);
        }
    };

    // handlePost 함수
    const handlePost = async () => {
        // 1. 입력값 검증: selectedImage가 없으면 alert('이미지를 선택해주세요.') 후 return
        if (!selectedImage) {
            alert("이미지를 선택해주세요.");
            return;
        }
        // 2. try-catch-finally 블록 사용
        try {
            // 3. loading을 true로 설정
            setLoading(true);
            // 4. getFilteredFile(selectedImage, selectedFilter)로 필터 적용된 이미지 생성
            const filteredImage = await getFilteredFile(selectedImage, selectedFilter);
            // 5. apiService.createStory(filteredImage) 호출
            await apiService.createStory(filteredImage);
            // 6. 성공 시: alert('스토리가 성공적으로 업로드되었습니다.'), navigate('/feed')
            alert('스토리가 성공적으로 업로드되었습니다.');
            navigate('/feed');
        } catch (err) {
            // 7. 실패 시: console.error, alert('스토리 업로드에 실패했습니다.')
            console.error(err);
            alert('스토리 업로드에 실패했습니다.');

        } finally {
            // 8. finally: loading을 false로 설정
            setLoading(false);

        }
    };

    // handleRemoveImage 함수를 작성하세요
    const handleRemoveImage = () => {
        // 1. selectedImage를 null로 설정
        setSelectedImage(null);
        // 2. imagePreview를 null로 설정
        setImagePreview(null);
        // 3. selectedFilter를 'none'으로 설정
        setSelectedFilter('none');
    };

    return (
        <div className="upload-container">
            {/* 헤더 */}
            <Header type="upload"
                    title="새 스토리"
                    onSubmit={handlePost}
                    submitDisabled={!selectedImage}
                    loading={loading}
                    submitText={"공유"}
            />
            
            <div className="upload-content">
                <div className="upload-card">
                    {/* 이미지 업로드 영역 */}
                    <div className="upload-image-area">
                        {/* imagePreview가 있으면 이미지와 필터 표시, 없으면 업로드 UI 표시 */}
                        {/* 조건: imagePreview ? (...) : (...) */}

                        {/* imagePreview가 있을 때 */}
                        {imagePreview ? (
                            <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                                <div style={{position: 'relative'}}>
                                    {/* 이미지 미리보기 */}
                                    {/* src: imagePreview */}
                                    {/* style: { filter: selectedFilter } */}
                                    {/* className: "upload-preview-image" */}
                                    {imagePreview ? (
                                        <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                                            <div style={{position: 'relative'}}>
                                                <img
                                                    src={imagePreview}
                                                    alt={imagePreview}
                                                    className="upload-preview-image"
                                                    style={{filter: selectedFilter}}
                                                />

                                                {/* 이미지 삭제 버튼 */}
                                                {/* X 아이콘 사용, onClick: handleRemoveImage */}
                                                {/* position: absolute, top: 1rem, right: 1rem */}
                                                {/* backgroundColor: rgba(0, 0, 0, 0.6), color: white */}
                                                {/* borderRadius: 50%, width: 2rem, height: 2rem */}
                                                <button
                                                    onClick={handleRemoveImage}
                                                    style={{
                                                        position: 'absolute', top: '1rem', right: '1rem',
                                                        backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white',
                                                        borderRadius: '50%', width: '2rem', height: '2rem'
                                                    }}>
                                                    <X size={20}/>
                                                </button>
                                            </div>
                                            {/* 필터 스크롤 컨테이너 */}
                                            <div className="filter-scroll-container">

                                                {/* FILTER_OPTIONS.map으로 필터 목록 렌더링 */}
                                                {/* key: option.name */}
                                                {/* className: filter-item + (선택된 필터면 active 추가) */}
                                                {/* onClick: setSelectedFilter(option.filter) */}
                                                {FILTER_OPTIONS.map((option) => (
                                                    <div key={option.name}
                                                         className={`filter-item 
                                                     ${selectedFilter === option.filter ? 'active' : ''}  `}
                                                         onClick={() => setSelectedFilter(option.filter)}
                                                    >
                                                        <span className="filter-name">{option.name}</span>
                                                        <div className="filter-thumnail"
                                                             style={{
                                                                 backgroundImage: `url(${imagePreview})`,
                                                                 filter: option.filter,
                                                             }}
                                                        >

                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* 이미지 변경 버튼 */}
                                            {/* label 태그 사용, className: "upload-change-btn" */}
                                            {/* input type="file", accept="image/*", onChange: handleImageChange */}
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
                                    ) : (
                                        <label className="upload-label">
                                            <Image className="upload-icon"/>
                                            <span className="upload-text">
                                                스토리에 공유할 사진을 선택하세요
                                            </span>

                                            <span className="upload-select-btn">
                                                컴퓨터에서 선택
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="upload-file-input"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* imagePreview가 없을 때 - 업로드 UI */
                            <label className="upload-label">
                                {/* Image 아이콘 추가 (className: "upload-icon") */}
                                <Image className="upload-icon"/>

                                {/* 안내 텍스트 */}
                                <span className="upload-text">
                                    스토리에 공유할 사진을 선택하세요
                                </span>

                                {/* 선택 버튼 */}
                                <span className="upload-select-btn">
                                    컴퓨터에서 선택
                                </span>

                                {/* 파일 input */}
                                {/* type: "file", accept: "image/*" */}
                                {/* onChange: handleImageChange */}
                                {/* className: "upload-file-input" */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="upload-file-input"
                                />
                            </label>
                        )}
                    </div>

                    {/* 안내 메시지 (imagePreview가 있을 때만 표시) */}
                    {/* 조건: imagePreview && (...) */}
                    {imagePreview && (
                        <div style={{
                            padding: '1rem',
                            borderTop: '1px solid #dbdbdb',
                            backgroundColor: '#fafafa'
                        }}>
                            {/* 안내 문구 작성 */}
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#8e8e8e',
                                textAlign: 'center'
                            }}>
                                스토리는 24시간 후 자동으로 삭제됩니다
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryUploadPage;