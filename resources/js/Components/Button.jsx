import React from 'react';

const Button = ({disabled, children, className, type, onClick}) => {
    return (
        <button onClick={onClick} type={type} disabled={disabled} className={`border border-primary-500 p-2 bg-primary-500 text-white rounded-sm hover:bg-transparent hover:text-primary-500 ${className}`}>
            {children}
        </button>
    );
};

export default Button;
