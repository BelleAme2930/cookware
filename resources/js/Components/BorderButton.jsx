import React from 'react';

const BorderButton = ({disabled, children, className, type, onClick}) => {
    return (
        <button onClick={onClick} type={type} disabled={disabled} className={`border border-primary-500 p-2 bg-transparent text-primary-500 rounded-sm hover:bg-transparent hover:text-primary-500 ${className}`}>
            {children}
        </button>
    );
};

export default BorderButton;
