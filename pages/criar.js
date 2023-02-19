import React, { use, useEffect, useState } from 'react';
import { auth, storage } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { collection } from 'firebase/firestore';
import { addDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { updateDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';

const criar = () => {

    const [file, setImagemSelecionada] = useState(null);
    const [preview, setPreview] = useState();
    const [postagem, setPostagem] = useState({
        texto: '',
        imagem: '',
        data: '',
        usuario: '',
        curtidas: 0,
        comentarios: 0
    });

    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    const atualizarPostagem = router.query;

    const checarUsuario = async () => {
        if (loading) return;
        if (!user) router.push('/auth/login');

        if (atualizarPostagem.id) {
            setPostagem({
                texto: atualizarPostagem.texto,
                imagem: atualizarPostagem.imagem,
                data: atualizarPostagem.data,
                usuario: atualizarPostagem.usuario,
                curtidas: atualizarPostagem.curtidas,
                comentarios: atualizarPostagem.comentarios,
                id: atualizarPostagem.id
            });
        }
    }

    useEffect(() => {
        if (!file) {
            setPreview(undefined);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const onSelecionarImagem = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setImagemSelecionada(undefined);
            return;
        }

        setImagemSelecionada(e.target.files[0]);
    }

    const publicarPostagem = async (e) => {

        e.preventDefault();

        if (!postagem.texto) {
            toast.error('Você precisa escrever algo antes de publicar!😁', {
                position: 'top-center',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        };

        if (!file) {
            toast.error('Você precisa selecionar uma imagem antes de publicar!😁', {
                position: 'top-center',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        };

        const data = new Date();
        const dia = data.getDate();
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const hora = data.getHours();
        const minuto = data.getMinutes();
        const segundo = data.getSeconds();

        const dataFormatada = `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;

        // realiza upload da imagem selecionada
        if (file === null) return;

        const storageRef = ref(storage, `imagens/${file.name} + ${uuidv4()}`);

        try {
            const uploadTask = uploadBytesResumable(storageRef, file);
            await uploadTask;
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            // pega url da imagem

            if (postagem.id) {
                const docRef = doc(db, 'postagens', postagem.id);
                const postagemAtualizada = {
                    ...postagem,
                    texto: postagem.texto,
                    imagem: url,
                    data: dataFormatada,
                    usuario: user.displayName,
                    curtidas: postagem.curtidas,
                    comentarios: postagem.comentarios,
                    fotoUsuario: user.photoURL,
                    usuarioId: user.uid
                };

                await updateDoc(docRef, postagemAtualizada);
                toast.success('Postagem atualizada com sucesso!😁', {
                    position: 'top-center',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return router.push('/');
            } else {

                const collectionRef = collection(db, 'postagens');
                await addDoc(collectionRef, {
                    texto: postagem.texto,
                    imagem: url,
                    data: dataFormatada,
                    usuario: user.displayName,
                    curtidas: 0,
                    comentarios: 0,
                    fotoUsuario: user.photoURL,
                    usuarioId: user.uid
                }).then(() => {
                    toast.success('Postagem publicada com sucesso!😁', {
                        position: 'top-center',
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    router.push('/');
                }).catch((error) => {
                    console.log(error);
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        checarUsuario();
    }, [user, loading]);

    return (
        <div
            className='flex flex-col justify-center items-center'
        >
            <h1
                className='text-2xl font-bold'
            >
                {atualizarPostagem.id ? 'Atualizar postagem' : 'Criar postagem'}
            </h1>
            <form
                onSubmit={publicarPostagem}
                className='flex flex-col shadow-xl p-5 rounded-lg mt-5 items-center'
            >
                <div
                    className=''
                >
                    <textarea
                        maxLength={450}
                        value={postagem.texto}

                        onChange={(e) => setPostagem({ ...postagem, texto: e.target.value })}
                        placeholder="Digite aqui"
                        className='w-[400px] border-2 border-black rounded-md p-2 resize-none mt-3 h-64'
                    >
                    </textarea>
                    <p className={`text-xs text-gray-500 mb-3 ${postagem.texto.length > 450 ? 'text-red-500 mb-3' : ''}`}>
                        {postagem.texto.length}/450
                    </p>
                </div>

                {file && (
                    <div
                        className='w-[400px] h-[250px] rounded-md relative mb-3'
                    >
                        <Image
                            src={preview}
                            alt="Imagem selecionada"
                            layout='fill'
                            objectFit='cover'
                            className='rounded-md'
                        />
                    </div>
                )}

                <div className='file-input mb-2'>
                    <input
                        type="file"
                        onChange={onSelecionarImagem}
                        accept="image/*"
                    />
                    <label>
                        <span>Selecionar imagem</span>
                    </label>
                </div>

                <button
                    type='submit'
                    className="hover:text-white hover:bg-black border-2 border-black rounded-md p-2"
                >Publicar</button>
            </form>
        </div>
    )
}

export default criar;