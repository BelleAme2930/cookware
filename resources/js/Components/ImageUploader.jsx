import React from 'react';

const ImageUploader = ({ id, onChange, error }) => {
    return (
        <div className="mb-4 w-full px-2">
            <label className="block text-gray-700" htmlFor={id}>Product Image</label>
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
