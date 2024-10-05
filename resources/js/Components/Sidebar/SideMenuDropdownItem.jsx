import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const SideMenuDropdownItem = ({ label, children, icon, isOpen }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(isOpen);

    return (
        <div>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-700 border-b border-gray-200 hover:bg-primary-100 hover:text-primary-900 transition-all duration-200"
            >
                <div className="flex items-center">
                    {icon && <span className="inline-block mr-3"><FontAwesomeIcon icon={icon} className="text-primary-500" /></span>}
                    {label}
                </div>
                <span className="ml-auto">
                    <FontAwesomeIcon icon={isDropdownOpen ? faChevronUp : faChevronDown} />
                </span>
            </button>
            {isDropdownOpen && (
                <div className='ml-3'>
                    {children}
                </div>
            )}
        </div>
    );
};

export default SideMenuDropdownItem;
