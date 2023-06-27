import {
  addDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../config/firebase";
import { Post as IPost } from "./main";
import styles from "../../styles/Post.module.css";

interface Props {
  post: IPost;
}

interface Like {
  likeId: string;
  userId: string;
}

interface Comment {
  commentId: string;
  userId: string;
  postId: string;
  content: string;
  username: string;
}

export const Post = (props: Props) => {
  const { post } = props;
  const [user] = useAuthState(auth);

  const [likes, setLikes] = useState<Like[] | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null); // State for comments

  const likesRef = collection(db, "likes");
  const commentsRef = collection(db, "comments"); // Reference to the comments collection

  const likesDoc = query(likesRef, where("postId", "==", post.id));
  const commentsDoc = query(commentsRef, where("postId", "==", post.id)); // Query for fetching comments

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id })));
  };

  const getComments = async () => {
    const data = await getDocs(commentsDoc);
    setComments(
      data.docs.map((doc) => ({
        commentId: doc.id,
        userId: doc.data().userId,
        postId: doc.data().postId,
        content: doc.data().content,
        username: doc.data().username,
      }))
    );
  };

  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev ? [...prev, { userId: user.uid, likeId: newDoc.id }] : [{ userId: user.uid, likeId: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );

      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeToDelete = doc(db, "likes", likeId);
      await deleteDoc(likeToDelete);
      if (user) {
        setLikes((prev) => prev && prev.filter((like) => like.likeId !== likeId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addComment = async (content: string, displayName: string) => {
    try {
      const newDoc = await addDoc(commentsRef, {
        userId: user?.uid,
        postId: post.id,
        content: content,
        username: displayName,
      });
      if (user) {
        setComments((prev) =>
          prev
            ? [
                ...prev,
                { commentId: newDoc.id, userId: user.uid, postId: post.id, content: content, username: displayName },
              ]
            : [{ commentId: newDoc.id, userId: user.uid, postId: post.id, content: content, username: displayName }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  useEffect(() => {
    getLikes();
    getComments();
  }, []);

  return (
    <div className={`${styles.content}`}>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>

      <div className={`${styles.card}`}>
        {post.imageUrl && <img className={`${styles.cardImage}`} src={post.imageUrl} alt="Card image" />}
        <div className="card-body">
          <h1 className="card-title">{post.title}</h1>
          <p className="card-text mt-1 p-3">{post.description}</p>
        </div>
        <div className="footer">
          <p>@{post.username}</p>
          <button className="btn btn-dark mb-3" onClick={hasUserLiked ? removeLike : addLike}>
            {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}{" "}
          </button>
          {likes && <p>Likes: {likes.length}</p>}

          {user && (
            <div>
               <hr className={`${styles.hr}`} />
              <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const commentInput = form.elements.namedItem("comment") as HTMLInputElement;
                const content = commentInput.value;
                const displayName = user?.displayName || ""; // Perform null check and provide a default value
                addComment(content, displayName);
                form.reset();
              }}
            >
                <input
                  className={`form-control mt-4 ${styles.commentWidth}`}
                  type="text"
                  name="comment"
                  placeholder="Add a comment"
                />
                <button className="btn btn-dark mt-3" type="submit">
                  Post
                </button>
              </form>
            </div>
          )}

          {comments &&
            comments.map((comment) => (
              <div>
                <hr className={`${styles.hr}`} />
                <h5>Comments: </h5>
                  <div className={`${styles.commentBg}`} key={comment.commentId}>
                    <p>{comment.username}</p>
                    <p>{comment.content}</p>
                  </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
