import React, { useState } from 'react';
import SideMenuItem from './SideMenuItem';
import SideMenuDropdownItem from './SideMenuDropdownItem';
import { Link } from "@inertiajs/react";
import Image from "@/Components/Image.jsx";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    return (
        <div
            className={`fixed top-0 left-0 h-full ${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-md transition-all duration-300 ease-in-out`}
        >
            <div className="flex justify-between items-center p-4">
                <Link href="/" className={`${isCollapsed ? 'hidden' : 'block'}`}>
                    <Image src="/assets/images/logo.png" className='h-12'/>
                </Link>
                <button
                    className="text-gray-500 focus:outline-none"
                    onClick={toggleSidebar}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={isCollapsed ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                        />
                    </svg>
                </button>
            </div>

            <div className={`pb-4 mt-8 ${isCollapsed ? 'hidden' : 'block'}`}>
                <SideMenuItem label="Dashboard" href={route('dashboard')} />
                <SideMenuDropdownItem label="Categories">
                    <SideMenuItem label="Add Category" href={route('categories.create')} />
                    <SideMenuItem label="Category Listing" href={route('categories.index')} />
                </SideMenuDropdownItem>
                <SideMenuDropdownItem label="Products">
                    <SideMenuItem label="Add Product" href={route('products.create')} />
                    <SideMenuItem label="Product Listing" href={route('products.index')} />
                </SideMenuDropdownItem>
                <SideMenuDropdownItem label="Suppliers">
                    <SideMenuItem label="Add Supplier" href={route('suppliers.create')} />
                    <SideMenuItem label="Supplier Listing" href={route('suppliers.index')} />
                </SideMenuDropdownItem>
                <SideMenuDropdownItem label="Customers">
                    <SideMenuItem label="Add Customer" href={route('customers.create')} />
                    <SideMenuItem label="Customer Listing" href={route('customers.index')} />
                </SideMenuDropdownItem>
            </div>
        </div>
    );
};

export default Sidebar;
