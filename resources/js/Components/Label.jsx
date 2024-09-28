import React from 'react';

const Label = ({title, htmlFor, className, required}) => {
    return (
        <label htmlFor={htmlFor} className={`block text-md font-medium text-gray-700 mb-1 ${className}`}>
            {title} {required && <span className='text-red-600'>*</span>}
        </label>
    );
};

export default Label;
