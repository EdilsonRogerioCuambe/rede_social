import React, { useEffect, useState } from 'react';
import { auth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import Mensagem from '../components/Mensagem';
import { BsTrash2Fill } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import Link from 'next/link';

const perfil = () => {

    const [user, loading, error] = useAuthState(auth);
    const [postagens, setPostagens] = useState([]);

    const router = useRouter();

    console.log(user);

    const getData = async () => {
        const collectionRef = collection(db, 'postagens');
        const q = query(collection(db, 'postagens'), where('usuarioId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setPostagens(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });

        return unsubscribe;
    }

    const deletarPostagem = async (id) => {
        const docRef = doc(db, 'postagens', id);
        await deleteDoc(docRef);
    }

    if (loading) return <div>Carregando...</div>
    if (!user) return <div>Carregando...</div>

    const checarUsuario = async () => {
        if (loading) return;
        if (!user) router.push('/auth/login');
    }

    const sair = async () => {
        await auth.signOut();
        router.push('/auth/login');
    }

    useEffect(() => {
        checarUsuario();
        getData();
    }, [user, loading]);

    return (
        <div
            className='flex flex-col justify-center items-center'
        >
            <h1 className='text-2xl font-bold'>Suas postagens</h1>
            <div>
                {postagens.map(postagem => {
                    return (
                        <Mensagem
                            key={postagem.id}
                            id={postagem.id}
                            texto={postagem.texto}
                            imagem={postagem.imagem}
                            data={postagem.data}
                            usuario={postagem.usuario}
                            fotoUsuario={postagem.fotoUsuario}
                        >
                            <Link
                                className='inline-block'
                                href={{ 
                                        pathname: '/criar',
                                        query: {
                                            id: postagem.id,
                                            texto: postagem.texto,
                                            imagem: postagem.imagem,
                                            data: postagem.data,
                                            usuario: postagem.usuario,
                                            curtidas: postagem.curtidas,
                                            comentarios: postagem.comentarios,
                                            fotoUsuario: postagem.fotoUsuario,
                                        }  
                                    }}>
                                <button
                                    className='border-blue-500 py-2 my-2 hover:border-blue-700 text-blue-400 font-bold rounded border-2 hover:scale-105 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl px-10'
                                >
                                    <AiFillEdit
                                        className='inline-block mr-1'
                                    /> Editar
                                </button>
                            </Link>
                            <button
                                onClick={() => deletarPostagem(postagem.id)}
                                className='border-red-500 py-2 my-2 hover:border-red-700 text-red-400 font-bold rounded border-2 hover:scale-105 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl'
                            >
                                <BsTrash2Fill
                                    className='inline-block mr-1'
                                /> Excluir
                            </button>
                        </Mensagem>
                    )
                })}
            </div>
            <button
                className='mt-3 mb-3 border-red-500 hover:border-red-700 text-red-400 font-bold py-2 px-4 rounded border-2 hover:scale-105 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl'
                onClick={sair}
            >Sair</button>
        </div>
    )
}

export default perfil;