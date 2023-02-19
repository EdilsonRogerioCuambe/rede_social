import React from 'react';
import Nav from './Nav';

const Layout = ({ children }) => {
    return (
        <div className='font-prompt md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-7xl mx-auto'>
            <Nav />
            <main>
                {children}
            </main>
        </div>
    )
}

export default Layout;