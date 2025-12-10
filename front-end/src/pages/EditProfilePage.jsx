import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import apiService from '../service/apiService';
import {getImageUrl} from '../service/commonService';
import Header from '../components/Header';
import '../App.css';

const EditProfilePage = () => {
    // navigate 선언
    const navigate = useNavigate();

    // 상태 선언
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // 입력 폼 상태 선언
    const [formData, setFormData] = useState({
        userName: '',
        userFullname: '',
        userEmail: ''
    });

    // 이미지 관련 상태 선언
    const [previewImage, setPreviewImage] = useState('');
    const [file, setFile] = useState(null);

    // useEffect로 loadUserData 호출
    useEffect(() => {
        loadUserData();
    }, []);

    // loadUserData 함수 작성
    const loadUserData = async () => {
        try {
            // 1. localStorage에서 user 가져오기 (JSON.parse)
            const user = JSON.parse(localStorage.getItem('user'));
            // 2. user가 없으면 navigate('/login')
            if (!user) navigate('/login');
            // // 3. apiService.getUser(storedUser.userId) 호출 -> 필요 없다...
            // const res = apiService.getUser(user.userId); -> localstorage 존재하기 때문에 필요 없으
            // 4. setUser(), setFormData(), setPreviewImage(getImageUrl()) 설정
            setUser(user);
            setFormData({
                userName: user.userName,
                userFullname: user.userFullname,
                userEmail: user.userEmail,
            });
            setPreviewImage(getImageUrl(user.userAvatar));

        } catch (err) {
            console.error('사용자 정보 로드 실패', err);
        }
    };

    // handleImageChange 함수 작성
    const handleImageChange = (e) => {
        // 1. e.target.files[0]으로 파일 가져오기
        const selectedFile = e.target.files[0];

        // 2. selectedFile이 있으면:
        if (selectedFile) {
            //- setFile(selectedFile)
            setFile(selectedFile);
            //- URL.()로 미리보기 URL 생성
            const imgUrl = URL.createObjectURL(selectedFile);
            //- setPreviewImage() 설정
            setPreviewImage(imgUrl);
        }
    };

    // handleChange 함수 작성 - 연희
    const handleChange = (e) => {
        // 1. e.target에서 name, value 추출 (구조분해)
        const {name, value} = e.target;
        // 2. setFormData(prev => ({ ...prev, [name]: value }))
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

    };

    // handleSubmit 함수 작성
    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);

        try {
            // 1. new FormData() 생성
            const submitData = new FormData;
            const {imgUrl, ...changeData} = formData;
            const updateBlob = new Blob(
                [JSON.stringify(changeData)],
                {type:"application/json"}
            )

            // 2. formData의 각 필드를 submitData.append()로 추가
            submitData.append("formData", updateBlob);

            // 3. file이 있으면 submitData.append('profileImage', file)
            if (file) {
                submitData.append('profileImage', file); // 이미지 이름 controller 와 맞게
            }
            // 4. apiService.updateProfile(user.userId, submitData) 호출
            await apiService.updateProfile(user.userId, submitData);

            // 로컬스토리지 수정(sql에 저장된 user 정보로 다시 가져오기
            const savedUser = localStorage.getItem('user');
            console.log("savedUser", savedUser);

            localStorage.getItem('user');
            // 5. alert('프로필이 저장되었습니다.')
            alert('프로필이 저장되었습니다.');

            // 6. navigate('/myfeed')
            navigate('/myfeed');

        } catch (err) {
            console.error(err);
            console.log("왜 오류가 발생하는가?", err);
            alert('프로필 저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="feed-container">
            <Header/>

            <div className="edit-profile-wrapper">
                <div className="edit-profile-card">
                    {/* 사이드바 구현 */}
                    <div className="edit-profile-sidebar">
                        {/* '프로필 편집', '비밀번호 변경', '앱 및 웹사이트' div 3개 */}
                        <div className="sidebar-item active">프로필 편집</div>
                        <div className="sidebar-item">비밀번호 변경</div>
                        <div className="sidebar-item">앱 및 웹사이트</div>
                    </div>

                    <div className="edit-profile-form">
                        {/* 프로필 사진 섹션 구현 */}
                        <div className="form-group photo-section">
                            {/* TODO 이미지 디테일 만들기 */}
                            <div className="photo-label-area">
                                {/* img 태그: src={previewImage} */}
                                <img src={previewImage}
                                     alt="프로필 미리보기"
                                     className="edit-profile-avatar"
                                />
                            </div>
                            <div className="photo-input-area">
                                {/* user.userName 표시 */}
                                {/* label: htmlFor="profile-upload" */}
                                {/* input: type="file", onChange={handleImageChange} */}
                                <label htmlFor="profile-upload" className="photo-change-btn">
                                    프로필 사진 바꾸기
                                </label>
                                <input
                                    id="profile-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{display: 'none'}}
                                />
                            </div>
                        </div>

                        {/* 이름 입력 필드 */}
                        <div className="form-group">
                            {/* label: "이름" */}
                            {/* input: name="userFullname", value, onChange */}
                            <label className="form-label">이름</label>
                            <div className="form-input-wrapper">
                                <input className="edit-input"
                                       type="text"
                                       name="userFullname"
                                       value={formData.userFullname}
                                       onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* 사용자 이름 입력 필드 */}
                        <div className="form-group">
                            {/* label: "사용자 이름" */}
                            {/* input: name="userName", value, onChange */}
                            <label className="form-label">사용자 이름</label>
                            <div className="form-input-wrapper">
                                <input className="edit-input"
                                       type="text"
                                       name="userName"
                                       value={formData.userName}
                                       onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* 이메일 입력 필드 */}
                        <div className="form-group">
                            {/* label: "이메일" */}
                            {/* input: name="userEmail", value, onChange, disabled */}
                            <label className="form-label">이메일</label>
                            <div className="form-input-wrapper">
                                <input className="edit-input"
                                       type="text"
                                       name="userEmail"
                                       value={formData.userEmail}
                                       onChange={handleChange}
                                       disabled={true}
                                       readOnly
                                />
                            </div>
                        </div>

                        {/* 제출 버튼 */}
                        <div className="form-group">
                            <label className="form-label"></label>
                            {/* button: onClick={handleSubmit}, disabled={loading} */}
                            <button className="edit-submit-btn"
                                    onClick={handleSubmit}
                                    disabled={loading}
                            >
                                {loading ? '저장 중...' : '수정'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;
