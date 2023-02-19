import { useEffect } from 'react';
import Image from 'next/image';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../../utils/firebase';

import { Google } from '../../assets';

const login = () => {

    const router = useRouter();

    const [user, loading, error] = useAuthState(auth);

    const provider = new GoogleAuthProvider();

    const entrarComGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            router.push('/');
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user) {
            router.push('/');
        } else {
            router.push('/auth/login');
        }
    }, [user]);

    return (
        <div
            className='shadow-2xl rounded-xl p-4 mt-52 justify-center items-center flex flex-col'
        >
            <h1 className='text-2xl font-bold'>
                Junte-se a nós ainda hoje!
            </h1>
            <div className='flex flex-col mt-3'>
                <button
                    onClick={entrarComGoogle}
                    className='flex items-center justify-center mt-2 p-2 rounded-md border-2 border-black hover:scale-95 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl'
                >
                    <Image
                        src={Google}
                        alt='Google Logo'
                        width={60}
                        height={60}
                    />
                    <p
                        className='ml-2'
                    >
                        Entrar com o Google
                    </p>
                </button>

            </div>
        </div>
    )
}

export default login;