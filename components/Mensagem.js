import React from 'react';
import Image from 'next/image';

const Mensagem = ({ usuario, fotoUsuario, imagem, texto, data, curtidas, comentarios, children }) => {

    return (
        <div
            className="shadow-lg rounded-lg bg-white p-4 flex flex-col justify-between mb-4 mt-4 max-w-[430px]"
        >
            <div
                className="flex justify-between items-center"
            >
                <Image
                    alt='Foto de perfil'
                    src={fotoUsuario}
                    width={40}
                    height={40}
                    className="rounded-full border-2 p-1 border-black m-1"
                />
                <h2 className="text-md font-medium">{usuario}</h2>
            </div>
            <div
                className="w-[400px] h-[250px] rounded-md relative mb-3"
            >
                <Image
                    alt='Foto de perfil'
                    src={imagem}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md mx-auto"
                />
            </div>
            <div
                className="flex justify-between items-center"
            >
                <p>{texto}</p>
            </div>
            <div
                className="flex justify-between items-center"
            >
                <p className="text-md pt-2 text-gray-500">{data}</p>
            </div>
            {children}
        </div>
    )
}

export default Mensagem;