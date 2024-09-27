import React, { useState } from 'react';

const SideMenuDropdownItem = ({ label, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="block w-full px-4 py-2 text-left text-gray-700 border-t border-gray-200 hover:bg-gray-200"
            >
                {label}
            </button>
            {isOpen && (
                <div className="pl-4">
                    {children}
                </div>
            )}
        </div>
    );
};

export default SideMenuDropdownItem;
