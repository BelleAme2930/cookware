import React from 'react';
import { Link } from '@inertiajs/react';

const SideMenuItem = ({ label, href, icon }) => {
    return (
        <Link href={href} className="block px-4 py-3 text-gray-700 border-b border-gray-200 hover:bg-primary-100 hover:text-primary-900 transition-all duration-200">
            {icon && <span className="inline-block mr-3">{icon}</span>}
            {label}
        </Link>
    );
};

export default SideMenuItem;
