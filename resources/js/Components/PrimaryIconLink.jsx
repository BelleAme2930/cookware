import React from 'react';
import { Link } from "@inertiajs/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PrimaryIconLink = ({ children, icon, href }) => {
    return (
        <div>
            <Link href={href}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
                {children}
            </Link>
        </div>
    );
};

export default PrimaryIconLink;
