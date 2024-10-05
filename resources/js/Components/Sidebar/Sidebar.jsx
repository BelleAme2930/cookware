import React from 'react';
import SideMenuItem from './SideMenuItem';
import SideMenuDropdownItem from './SideMenuDropdownItem';
import { Link } from "@inertiajs/react";
import Image from "@/Components/Image.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faTags,
    faBox,
    faUserFriends,
    faShoppingCart,
    faFileInvoiceDollar,
    faDollarSign,
    faTimes, faBars, faSackDollar
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    return (
        <div
            className={`fixed top-0 left-0 h-full ${isCollapsed ? 'w-16' : 'w-56'} bg-white shadow-lg transition-all duration-300 ease-in-out`}
        >
            <div className={`flex items-center px-4 py-3 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <Link href="/" className={`${isCollapsed ? 'opacity-0 w-0' : 'opacity-1'} transition-opacity`}>
                    <Image src="/assets/images/logo.png" className='h-12'/>
                </Link>
                <button
                    className="text-gray-500 focus:outline-none"
                    onClick={toggleSidebar}
                >
                    <FontAwesomeIcon className='text-2xl text-black' icon={isCollapsed ? faBars : faTimes}/>

                    {/*<svg*/}
                    {/*    xmlns="http://www.w3.org/2000/svg"*/}
                    {/*    fill="none"*/}
                    {/*    viewBox="0 0 24 24"*/}
                    {/*    strokeWidth="2"*/}
                    {/*    stroke="currentColor"*/}
                    {/*    className="w-6 h-6"*/}
                    {/*>*/}
                    {/*    <path*/}
                    {/*        strokeLinecap="round"*/}
                    {/*        strokeLinejoin="round"*/}
                    {/*        d={isCollapsed ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}*/}
                    {/*    />*/}
                    {/*</svg>*/}
                </button>
            </div>

            <div className={`pb-4 mt-8 ${isCollapsed ? 'hidden' : 'block'}`}>
                <SideMenuItem
                    label="Dashboard"
                    href={route('dashboard')}
                    icon={<FontAwesomeIcon icon={faTachometerAlt} className="text-primary-500"/>}
                />
                <SideMenuDropdownItem label="Categories" icon={faTags}>
                    <SideMenuItem label="Add Category" href={route('categories.create')} />
                    <SideMenuItem label="Category Listing" href={route('categories.index')} />
                </SideMenuDropdownItem>
                <SideMenuDropdownItem label="Products" icon={faBox}>
                    <SideMenuItem label="Add Product" href={route('products.create')} />
                    <SideMenuItem label="Product Listing" href={route('products.index')} />
                </SideMenuDropdownItem>
                <SideMenuDropdownItem label="Suppliers" icon={faUserFriends}>
                    <SideMenuItem label="Add Supplier" href={route('suppliers.create')} />
                    <SideMenuItem label="Supplier Listing" href={route('suppliers.index')} />
                </SideMenuDropdownItem>
                <SideMenuDropdownItem label="Customers" icon={faUserFriends}>
                    <SideMenuItem label="Add Customer" href={route('customers.create')} />
                    <SideMenuItem label="Customer Listing" href={route('customers.index')} />
                </SideMenuDropdownItem>
                <SideMenuDropdownItem label="Sales" icon={faShoppingCart}>
                    <SideMenuItem label="Add Sale" href={route('sales.create')} />
                    <SideMenuItem label="Sale Listing" href={route('sales.index')} />
                </SideMenuDropdownItem>
                <SideMenuDropdownItem label="Purchases" icon={faShoppingCart}>
                    <SideMenuItem label="Add Purchase" href={route('purchases.create')} />
                    <SideMenuItem label="Purchase Listing" href={route('purchases.index')} />
                </SideMenuDropdownItem>
                <SideMenuDropdownItem label="Accounts" icon={faDollarSign}>
                    <SideMenuItem label="Add Account" href={route('accounts.create')} />
                    <SideMenuItem label="Account Listing" href={route('accounts.index')} />
                </SideMenuDropdownItem>
                <SideMenuDropdownItem label="Invoices" icon={faFileInvoiceDollar}>
                    <SideMenuItem label="Sales Invoices" href={route('sales.invoices.index')} />
                    <SideMenuItem label="Purchase Invoices" href={route('purchases.invoices.index')} />
                </SideMenuDropdownItem>
                <SideMenuDropdownItem label="Expenses" icon={faSackDollar}>
                    <SideMenuItem label="Add Expense" href={route('expenses.create')} />
                    <SideMenuItem label="Expense Listing" href={route('expenses.index')} />
                </SideMenuDropdownItem>
            </div>
        </div>
    );
};

export default Sidebar;
