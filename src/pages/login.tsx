import { auth, provider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Post.module.css';

export const Login = () => {

    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, provider);
        navigate("/");
    }

    return (
    <div className={`${styles.background}`}>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>

        <button className={` ${["btn"]} ${["btn-dark"]} ${["pt-3"]} ${["pb-2"]} ${[styles.signIn]} `} onClick={ signInWithGoogle }><h3>Sign in with Google</h3></button>
    </div>
    );
};