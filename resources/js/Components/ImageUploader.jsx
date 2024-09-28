import React from 'react';

const ImageUploader = ({ id, onChange, error, value, title }) => {
    return (
        <div className="mb-4 w-full">
            <div className='flex justify-between items-center'>
                <label className="block text-gray-700" htmlFor={id}>{title ? title : 'Select Image'}</label>
                {value && (
                    <div className="mb-2">
                        <img src={`/${value}`} alt="Current Product" className="h-9 rounded-md" />
                    </div>
                )}
            </div>
            <input
                type="file"
                id={id}
                onChange={onChange}
                className={`w-full border border-gray-300 rounded-md p-2 ${error ? 'border-red-600' : ''}`}
                accept="image/*"
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>
    );
};

export default ImageUploader;
