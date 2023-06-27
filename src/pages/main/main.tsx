

import { getDocs, collection} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { Post } from './post'
import styles from '../../styles/Post.module.css';
export interface Post {
    id: string;
    userId: string;
    title: string;
    username: string;
    description: string;
    imageUrl: string;
}

export const Main = () => {

    const[postsList, setPostsList] = useState<Post[] | null>(null);
    const postsRef = collection(db, "posts");
    const getPosts = async () => {
        const data = await getDocs(postsRef)
        setPostsList(
            data.docs.map((doc) => ({...doc.data(), id: doc.id})) as Post[]
        );
    };

    useEffect(() => {
        getPosts();
    }, []);   

    return( 
        <div className={` ${[styles.background]}`}>
            {postsList?.map((post) => (
                <Post post={post} />
            ))}
        </div>
    );
}