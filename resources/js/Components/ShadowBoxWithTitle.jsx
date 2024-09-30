import React from 'react';

const ShadowBoxWithTitle = ({ title, children }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            <div>
                {children}
            </div>
        </div>
    );
};

export default ShadowBoxWithTitle;
