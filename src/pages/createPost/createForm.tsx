import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { addDoc, collection } from 'firebase/firestore';
import { auth,db } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { ref } from 'firebase/storage';
import { uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import styles from '../../styles/Post.module.css';



interface CreateFormData {
    title: string;
    description: string;
    image: FileList;
}


export const CreateForm = () => {

    const navigate = useNavigate();

    const [user] = useAuthState(auth);

    const schema = yup.object().shape({
        title: yup.string().required("You must add a title!"),
        description: yup.string().required("You must add a description!"),
    });

    const { 
        register, 
        handleSubmit, 
        formState: {errors} 
    } = useForm<CreateFormData>({
        resolver: yupResolver(schema)
    })

    const postsRef = collection(db, "posts");

    const storage = getStorage();

    const onCreatePost = async (data: CreateFormData) => {
        const imageFile = data.image[0];
        if (!imageFile) {
            await addDoc(postsRef, {
                title: data.title,
                description: data.description,
                username: user?.displayName,
                userId: user?.uid,
            });
        } else {
            const storageRef = ref(storage, 'images');
            const imageRef = ref(storageRef, imageFile.name);
            const snapshot = await uploadBytes(imageRef, imageFile);
            const imageUrl = await getDownloadURL(snapshot.ref);
        
            await addDoc(postsRef, {
                title: data.title,
                description: data.description,
                imageUrl: imageUrl,
                username: user?.displayName,
                userId: user?.uid,
            });
        }
        navigate("/");
    };

    return (
        <div className={` ${[styles.background]} `}>
            <div className={` ${[styles.createPostBackground]}`}>
                <form className={` ${[styles.cardCreate]} `} onSubmit={handleSubmit(onCreatePost)}>

                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>

                    <input className={` ${["form-control"]} ${["mt-3"]} ${[styles.commentWidth]} `} placeholder="Title..." {...register("title")} />
                    <p className="mt-1">{errors.title?.message}</p>
                    <textarea className={` ${["form-control"]} ${["mt-5"]} ${[styles.commentWidth]} `} placeholder="Description..." {...register("description")} />
                    <p className="mt-1">{errors.description?.message}</p>
                    <input className={` ${["form-control"]} ${["mt-5"]} ${[styles.file]}`} type="file" {...register("image")} />
                    <input className="btn btn-dark mt-5" type="submit"/>
                </form>
            </div>
        </div>
    )
};
