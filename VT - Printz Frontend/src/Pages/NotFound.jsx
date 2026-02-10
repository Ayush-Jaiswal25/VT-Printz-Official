import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col justify-center items-center h-[70vh] bg-gray-50 text-center px-6 pt-[84px]">
            <h1 className="text-9xl font-bold text-[#DB2A7B] drop-shadow-lg animate-bounce">
                404
            </h1>
            <h2 className="text-4xl font-semibold text-[#02192F] mt-4">
                Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mt-2 max-w-md">
                Oops! The page you are looking for doesn't exist. It might have been moved or deleted.
            </p>

            <Link
                to="/"
                className="mt-8 px-8 py-3 bg-[#DB2A7B] text-white font-bold rounded-full shadow-lg hover:bg-[#b01e60] transition-transform transform hover:scale-105"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
