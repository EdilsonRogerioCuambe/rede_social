import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db, auth } from '../utils/firebase';
import { toast } from 'react-toastify';
import Mensagem from '@/components/Mensagem';
import { arrayUnion, doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';

const Publicacao = () => {

    const router = useRouter();
    const routeData = router.query;
    const [comentario, setComentario] = useState('');
    const [todosComentarios, setTodosComentarios] = useState([]);

    const enviarComentario = async () => {
        if (!auth.currentUser) {
            toast.error('Você precisa estar logado para comentar', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return router.push('/auth/login');
        } else if (comentario.length < 1) {
            return toast.error('Você precisa escrever algo para comentar', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else if (comentario.length > 100) {
            return toast.error('Seu comentario deve ter no máximo 100 caracteres', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            const docRef = doc(db, 'postagens', routeData.id);
            await updateDoc(docRef, {
                comentarios: arrayUnion({
                    comentario: comentario,
                    usuario: auth.currentUser.displayName,
                    fotoUsuario: auth.currentUser.photoURL,
                    data: new Date().toLocaleString('pt-BR')
                })
            });
            toast.success('Comentario enviado com sucesso', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setComentario('');
        }
    }

    const getComentarios = async () => {
        const docRef = doc(db, 'postagens', routeData.id);
        const docSnap = await getDoc(docRef);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            setTodosComentarios(snapshot.data().comentarios);
        });
        return () => unsubscribe();
    }

    useEffect(() => {
        if (!router.isReady) return;
        getComentarios();
    }, [router.isReady]);

    return (
        <div
            className='flex flex-col items-center justify-center py-2 max-w-[430px] mx-auto'
        >
            <Mensagem
                id={routeData.id}
                texto={routeData.texto}
                imagem={routeData.imagem}
                data={routeData.data}
                usuario={routeData.usuario}
                fotoUsuario={routeData.fotoUsuario}
            >

            </Mensagem>
            <div
                className='flex flex-col items-center justify-center w-full px-4 py-2 mt-4 bg-white rounded-md shadow-xl'
            >
                <div>
                    <input
                        type='text'
                        placeholder='Escreva um comentário📩'
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        className='w-[400px] p-4 my-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
                    />
                    <button
                        className='px-4 py-2 text-black border-2 border-black rounded-md hover:scale-75 transition-all duration-300 my-3'
                        type='submit'
                        onClick={enviarComentario}
                    >
                        Enviar
                    </button>
                </div>

            </div>
            <div
                className='flex flex-col items-start justify-start px-4 py-2 mt-4 w-[450px]'
            >
                <h2>Comentarios</h2>
                {
                    todosComentarios.map((comentario, idx) => (
                        <div className='bg-white rounded-md shadow-xl mt-2'
                            key={idx}
                        >
                            <div
                                className='flex px-4 py-2 mt-4 w-[450px]'
                            >
                                <div
                                    className='justify-start w-12 h-12 rounded-full'
                                >
                                    <img
                                        className='w-12 h-12 rounded-full'
                                        src={comentario.fotoUsuario}
                                        alt='Foto de perfil'
                                    />
                                </div>
                                <div
                                    className='items-start justify-start mx-4'
                                >
                                    <h3
                                        className='text-md text-gray-700'
                                    >{comentario.usuario}</h3>
                                </div>
                            </div>
                            <div
                                className='flex px-4 py-2 w-[450px]'
                            >
                                <p
                                    className='text-md text-gray-700'
                                >{comentario.comentario}</p>
                            </div>
                            <div
                                className='flex px-4 py-2 w-[450px]'
                            >
                                <p
                                    className='text-md text-gray-700'
                                >{comentario.data}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Publicacao;