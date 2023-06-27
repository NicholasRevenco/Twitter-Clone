import { getDocs, collection, where, query, DocumentSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db, auth } from '../../config/firebase';
import { Post } from './post';
import styles from '../../styles/Post.module.css';
import { Link } from 'react-router-dom';

export interface MyPosts {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
  imageUrl: string;
}

export const OwnPosts = () => {
  const [myPosts, setMyPosts] = useState<MyPosts[]>([]);
  const postsRef = collection(db, "posts");

  const getMyPosts = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const realquery = query(postsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(realquery);
      setMyPosts(
        querySnapshot.docs.map((doc: DocumentSnapshot) => ({
          ...doc.data(),
          id: doc.id,
        })) as MyPosts[]
      );
    }
  };

  useEffect(() => {
    getMyPosts();
  }, []);

  const deletePost = async (id: string) => {
    const firebaseDoc = doc(db, "posts", id);
    await deleteDoc(firebaseDoc);
    setMyPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  }
  
  const [updatedTitle, setUpdateTitle] = useState("");
  const updateTitle = async (id: string) => {
    const firebaseDoc = doc(db, "posts", id);
    await updateDoc(firebaseDoc, { title: updatedTitle });
    setUpdateTitle("");
    setMyPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === id) {
          return { ...post, title: updatedTitle };
        }
        return post;
      })
    );
  };  
  
  return (
    <div className={` ${[styles.background]}`}>

      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>

      {myPosts?.length < 1 ? (
        <div className={` ${[styles.noPosts]} `}>
          <h2 className={` ${["text-center"]} `}>You have no posts</h2>
          <h1>
            <Link className={` ${["btn"]} ${["pt-2"]} ${["mt-3"]} ${["btn-dark"]} ${[styles.noPostCreateOne]}`} to="/createPost">
              <h3>Create One!</h3>
            </Link>
          </h1>
        </div>
      ) : (
        <div>
          {myPosts?.map((post) => (
            <div>
              <Post post={post} />
                <form>
                  <input
                    className={` ${["form-control"]} ${[styles.newTitle]}  ${[styles.inline]} ${["me-3"]} `}
                    type="text"
                    placeholder="New title..."
                    onChange={(e) => setUpdateTitle(e.target.value)}
                  />
                  <button className={` ${["btn"]} ${["btn-success"]}  ${[styles.inline]} `} onClick={() => {updateTitle(post.id); }}>Update Title</button>
                </form>

                <button className="btn btn-danger" onClick={() => {deletePost(post.id); }}>Delete Post</button>
            
                <hr className={` ${["mt-5"]} ${[styles.postHr]} `} />
            </div>
          ))}
          </div>
      )}
    </div>
  );
};
