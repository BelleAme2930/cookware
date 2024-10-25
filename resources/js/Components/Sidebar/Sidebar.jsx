import React from 'react';
import SideMenuItem from './SideMenuItem';
import SideMenuDropdownItem from './SideMenuDropdownItem';
import { Link } from "@inertiajs/react";
import Image from "@/Components/Image.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faTags,
    faBoxOpen,
    faUser,
    faUsers,
    faShoppingBasket,
    faFileInvoice,
    faMoneyBillWave,
    faFileAlt, faTimes, faBars, faBasketShopping, faHandHoldingDollar
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const currentPath = window.location.pathname;

    const menuItems = [
        {
            label: "Dashboard",
            href: route('dashboard'),
            icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-primary-500"/>,
        },
        {
            label: "Categories",
            dropdown: true,
            icon: faTags,
            subItems: [
                { label: "Add Category", href: route('categories.create') },
                { label: "Category Listing", href: route('categories.index') },
            ],
        },
        {
            label: "Products",
            dropdown: true,
            icon: faBoxOpen,
            subItems: [
                { label: "Add Product", href: route('products.create') },
                { label: "Product Listing", href: route('products.index') },
            ],
        },
        {
            label: "Suppliers",
            dropdown: true,
            icon: faUsers,
            subItems: [
                { label: "Add Supplier", href: route('suppliers.create') },
                { label: "Supplier Listing", href: route('suppliers.index') },
            ],
        },
        {
            label: "Customers",
            dropdown: true,
            icon: faUser,
            subItems: [
                { label: "Add Customer", href: route('customers.create') },
                { label: "Customer Listing", href: route('customers.index') },
            ],
        },
        {
            label: "Sales",
            dropdown: true,
            icon: faHandHoldingDollar,
            subItems: [
                { label: "Add Sale", href: route('sales.create') },
                { label: "Sale Listing", href: route('sales.index') },
            ],
        },
        {
            label: "Purchases",
            dropdown: true,
            icon: faShoppingBasket,
            subItems: [
                { label: "Add Purchase", href: route('purchases.create') },
                { label: "Purchase Listing", href: route('purchases.index') },
            ],
        },
        {
            label: "Accounts",
            dropdown: true,
            icon: faMoneyBillWave,
            subItems: [
                { label: "Add Account", href: route('accounts.create') },
                { label: "Account Listing", href: route('accounts.index') },
            ],
        },
        {
            label: "Invoices",
            dropdown: true,
            icon: faFileInvoice,
            subItems: [
                { label: "Sales Invoices", href: route('sales.invoices.index') },
                { label: "Purchase Invoices", href: route('purchases.invoices.index') },
            ],
        },
        {
            label: "Expenses",
            dropdown: true,
            icon: faFileAlt,
            subItems: [
                { label: "Add Expense", href: route('expenses.create') },
                { label: "Expense Listing", href: route('expenses.index') },
            ],
        },
    ];

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
                </button>
            </div>

            <div className={`pb-4 mt-8 ${isCollapsed ? 'hidden' : 'block'}`}>
                {menuItems.map((item, index) => {
                    if (item.dropdown) {
                        const isOpen = item.subItems.some(subItem => {
                            const subItemPath = new URL(subItem.href).pathname;
                            return currentPath === subItemPath;
                        });

                        return (
                            <SideMenuDropdownItem key={index} label={item.label} icon={item.icon} isOpen={isOpen}>
                                {item.subItems.map((subItem, subIndex) => {
                                    const subItemPath = new URL(subItem.href).pathname;
                                    return (
                                        <SideMenuItem
                                            key={subIndex}
                                            label={subItem.label}
                                            href={subItem.href}
                                            isActive={currentPath === subItemPath}
                                        />
                                    );
                                })}
                            </SideMenuDropdownItem>
                        );
                    } else {
                        const itemPath = new URL(item.href).pathname;
                        return (
                            <SideMenuItem
                                key={index}
                                label={item.label}
                                href={item.href}
                                icon={item.icon}
                                isActive={currentPath === itemPath}
                            />
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default Sidebar;
