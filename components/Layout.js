import React from 'react';
import Nav from './Nav';

const Layout = ({ children }) => {
    return (
        <div className='mx-6 ml:max-w-4xl md:mx-auto sm:mx-6 font-prompt'>
            <Nav />
            <main>
                {children}
            </main>
        </div>
    )
}

export default Layout;