import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const IconButton = ({disabled, icon, className, type, onClick}) => {
    return (
        <button onClick={onClick} type={type} disabled={disabled} className={`border border-primary-500 p-2 bg-transparent text-primary-500 rounded-sm hover:bg-primary-500 hover:text-white ${className}`}>
            <FontAwesomeIcon icon={icon} />
        </button>
    );
};

export default IconButton;
