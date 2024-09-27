import React from 'react';

const Label = ({title, htmlFor, className}) => {
    return (
        <label htmlFor={htmlFor} className={`block text-md font-medium text-gray-700 mb-1 ${className}`}>
            {title}
        </label>
    );
};

export default Label;
