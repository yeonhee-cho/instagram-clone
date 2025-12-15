import {useState} from "react";
import {MoreHorizontal} from "lucide-react";

const PostOptionsMenu = ({post, currentUserId, onDelete}) => {
    const [showMenu, setShowMenu] = useState(false);
    const isOwnPost = post.userId === currentUserId; //포스트 작성자와 로그인 유저가 같나요?

    const handleDelete = () => {
        if(window.confirm("게시물을 삭제하시겠습니까?")) {
            onDelete(post.postId);
            setShowMenu(false);
        }
    }

    const handleReport = () => {
        alert("신고 기능은 준비 중입니다.");
        setShowMenu(false);
    }

    if(!showMenu) {
        return (
            <MoreHorizontal
                className="post-more-icon"
                onClick={() => setShowMenu(true)}
            />
        )
    }

    // 플래그먼트 태그 <></>
    return (
        <>
            <div className="post-menu-overlay">
                <div className="post-menu-modal">
                    {isOwnPost && (
                            <button className="post-menu-button delete" onClick={handleDelete}>
                                삭제하기
                            </button>
                        )
                    }
                    <button className="post-menu-button" onClick={handleReport}>
                        신고하기
                    </button>
                    <button className="post-menu-button cancel"
                            onClick={() => setShowMenu(false)}>
                        취소
                    </button>
                </div>
            </div>
        </>
    )
}
export default PostOptionsMenu;