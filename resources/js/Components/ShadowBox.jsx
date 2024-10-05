import React from 'react';

const ShadowBox = ({ children, className = '' }) => {
    return (
        <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
            <div>
                {children}
            </div>
        </div>
    );
};

export default ShadowBox;
