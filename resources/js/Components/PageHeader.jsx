import React from 'react';

const PageHeader = ({title}) => {
    return (
        <div className="flex items-center justify-between">
            <h2 className="text-lg leading-tight text-gray-800">{title}</h2>
        </div>
    );
};

export default PageHeader;
