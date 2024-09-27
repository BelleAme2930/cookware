import React from 'react';

const Label = ({title, htmlFor}) => {
    return (
        <label htmlFor={htmlFor} className="block text-md font-medium text-gray-700 mb-1">
            {title}
        </label>
    );
};

export default Label;
