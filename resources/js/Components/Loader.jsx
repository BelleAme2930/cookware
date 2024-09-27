import React from 'react';

const Loader = ({className}) => {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div
                className={`animate-spin rounded-full w-8 h-8 border-t-2 border-b-2 border-purple-500`}
            ></div>
        </div>
    );
};

export default Loader;
