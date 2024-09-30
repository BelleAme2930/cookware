import React from 'react';

const ShadowBox = ({ children }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div>
                {children}
            </div>
        </div>
    );
};

export default ShadowBox;
