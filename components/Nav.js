import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Nav = () => {

    const [user, loading, error] = useAuthState(auth);

    console.log(user);


    return (
        <nav
            className='text-black flex my-4 justify-between items-center max-w-6xl mx-auto md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-7xl'
        >
            <Link
                className='hover:scale-110 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg mt-5 p-3 border-2 border-black rounded-md'
                href="/">
                <button>
                    Social Spot
                </button>
            </Link>
            <ul
                className='flex'
            >
                {!user && (
                    <Link
                        className='hover:scale-110 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl p-3 rounded-md border-2 border-black'
                        href={"/auth/login"}>
                        <button>
                            Junte-se a nós
                        </button>
                    </Link>
                )}
                {user && (
                    <div
                        className='flex mt-4'
                    >
                        <Link
                            className='hover:scale-110 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl p-3 mr-3 rounded-md border-2 border-black justify-center items-center'
                            href={"/criar"}>
                            <button>
                                Criar uma postagem
                            </button>
                        </Link>

                        <Link
                            className='hover:scale-110 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl p-1 mr-3 rounded-full border-2 border-black'
                            href={"/perfil"}>
                            <img
                                className='rounded-full w-10 object-cover'
                                src={user.photoURL}
                                alt={user.displayName}
                            />
                        </Link>

                    </div>
                )}
            </ul>
        </nav>
    )
}

export default Nav;