
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="p-4 sm:p-6 text-center border-b border-gray-700">
            <div className="flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">Merch & Image Magic</h1>
            </div>
            <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
                Generate merchandise mockups or edit photos instantly. Powered by Gemini.
            </p>
        </header>
    );
};

export default Header;
