import React from 'react';

const Image = ({ src, className= '' }) => {
    return (
        <img className={className} src={src} alt='LG Cookware'/>
    );
};

export default Image;
