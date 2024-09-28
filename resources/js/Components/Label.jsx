import React from 'react';

const Label = ({title, htmlFor, className, required, suffix}) => {
    return (
        <label htmlFor={htmlFor} className={`block text-md font-medium text-gray-700 mb-1 ${className}`}>
            <div className='flex items-center justify-between'>
                <div>{title} {required && <span className='text-red-600'>*</span>}</div>
                {suffix && <div className='text-sm text-gray-500'>{suffix}</div>}
            </div>
        </label>
    );
};

export default Label;
