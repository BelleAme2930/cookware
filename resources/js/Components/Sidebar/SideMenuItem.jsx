import React from 'react';
import { Link } from '@inertiajs/react';

const SideMenuItem = ({ label, href }) => {
    return (
        <Link href={href} className="block px-4 py-2 text-gray-700 border-t border-gray-200 hover:bg-gray-200">
            {label}
        </Link>
    );
};

export default SideMenuItem;
