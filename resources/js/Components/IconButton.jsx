import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const IconButton = ({disabled, icon, className, type, onClick, children}) => {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={`flex items-center justify-center gap-2 border border-primary-500 p-2 bg-transparent text-primary-500 rounded-sm hover:bg-primary-500 hover:text-white ${className}`}>
            <FontAwesomeIcon icon={icon}/>
            {children && children}
        </button>
    );
};

export default IconButton;
