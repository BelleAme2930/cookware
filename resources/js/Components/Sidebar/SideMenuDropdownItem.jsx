import React, { useState } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const SideMenuDropdownItem = ({ label, children, icon }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="block w-full px-4 py-3 text-left text-gray-700 border-b border-gray-200 hover:bg-primary-100 hover:text-primary-900 transition-all duration-200"
            >
                {icon && <span className="inline-block mr-3"><FontAwesomeIcon icon={icon} className="text-primary-500"/></span>}
                {label}
            </button>
            {isOpen && (
                <div className='ml-3'>
                    {children}
                </div>
            )}
        </div>
    );
};

export default SideMenuDropdownItem;
