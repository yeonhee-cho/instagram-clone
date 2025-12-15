import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import apiService from "../service/apiService";
import {getImageUrl} from "../service/commonService";
import Header from "../components/Header";
import {Grid,Bookmark} from "lucide-react";


const UserFeedPage = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // 1. apiService => 데이터 가져오기 가져 온 데이터 List 형태로 출력
        loadUserFeedData();
    }, []);


    const loadUserFeedData = async () => {
        setLoading(true);
        try {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            console.log("currentUser", currentUser);
            const userId = currentUser.userId;
            console.log("userId", userId);

            if(!userId) return navigate('/login');

            setUser(currentUser);

            const allPosts = await apiService.getUserPost(userId);
            setPosts(allPosts);
            console.log("allPosts : ", allPosts);

            setUser({
                userAvatar: currentUser.userAvatar,
                userName: currentUser.userName
            })
        } catch (err) {
            console.log(err);
            alert("데이터를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }

    if(loading) return (
        <div>로딩중</div>
    )
    return (
        <div className="feed-container">
            <Header type="feed" />

            <main className="profile-wrapper">
                <header className="profile-header">
                    <div className="profile-image-container">
                        <div className="profile-image-border">
                            <img
                                src={getImageUrl(user.userAvatar)}
                                alt="profile"
                                className="profile-image-large"
                            />
                        </div>
                    </div>

                    <div className="profile-info-section">
                        <div className="profile-title-row">
                            <h2 className="profile-username">{user.userName}</h2>
                            <div className="profile-actions">
                                <button className="profile-edit-btn"
                                        onClick={()=>  navigate('/profile/edit')}
                                >
                                    프로필 편집
                                </button>
                                <button className="profile-archive-btn">보관함 보기</button>
                            </div>
                        </div>

                        <ul className="profile-stats">
                            <li>게시물 <strong>0</strong></li>
                            <li>팔로워 <strong>0</strong></li>
                            <li>팔로잉 <strong>0</strong></li>
                        </ul>
                    </div>
                </header>

                <div className="profile-stats-mobile">
                    <div className="stat-item">
                        <span className="stat-value">{posts.length}</span>
                        <span className="stat-label">게시물</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">0</span>
                        <span className="stat-label">팔로워</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">0</span>
                        <span className="stat-label">팔로잉</span>
                    </div>
                </div>

                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        <Grid size={12} /> 게시물
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                        onClick={() => setActiveTab('saved')}
                    >
                        <Bookmark size={12} /> 저장됨
                    </button>
                </div>

                <div className="profile-posts-grid">
                    {posts.map((post) => (
                        <div key={post.postId} className="grid-item">
                            <img src={post.postImage} alt="post" />
                            <div className="grid-hover-overlay"></div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default UserFeedPage;