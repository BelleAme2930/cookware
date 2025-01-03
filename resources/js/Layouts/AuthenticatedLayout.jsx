import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import {usePage} from '@inertiajs/react';
import {useState} from 'react';
import Sidebar from "@/Components/Sidebar/Sidebar.jsx";
import IconButton from "@/Components/IconButton.jsx";
import {faAdd} from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";

export default function Authenticated({header, children}) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}/>

            <div className={`flex-1 ${isCollapsed ? 'ml-16' : 'ml-56'} transition-all duration-300 ease-in-out`}>
                <nav className="border-b border-gray-100 bg-white">
                    <div className="mx-auto px-8">
                        <div className="flex h-16 justify-between">
                            <div className="hidden sm:flex sm:items-center">
                                <div className="relative add-items-menu">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                    <IconButton
                                                        icon={faAdd}
                                                        className='w-8 h-8 !bg-primary-500 !text-white'
                                                    />
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('categories.create')}>
                                                Add New Category
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('products.create')}>
                                                Add New Product
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('suppliers.create')}>
                                                Add New Supplier
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('customers.create')}>
                                                Add New Customer
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('purchases.create')}>
                                                Add New Purchase
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('sales.create')}>
                                                Add New Sale
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('accounts.create')}>
                                                Add New Account
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="hidden sm:flex sm:items-center gap-4">
                                <PrimaryIconLink className='!rounded-lg' href={route('sales.create')}>
                                    Point of Sale
                                </PrimaryIconLink>
                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                >
                                                    {user.name}
                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                              strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M4 6h16M4 12h16M4 18h16"/>
                                        <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                              strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                        <div className="space-y-1 pb-3 pt-2">
                            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                Dashboard
                            </ResponsiveNavLink>
                        </div>
                        <div className="border-t border-gray-200 pb-1 pt-4">
                            <div className="px-4">
                                <div className="text-base font-medium text-gray-800">{user.name}</div>
                                <div className="text-sm font-medium text-gray-500">{user.email}</div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button">Log
                                    Out</ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {header && (
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-[96%] py-4">
                            {header}
                        </div>
                    </header>
                )}

                <main>{children}</main>
            </div>
        </div>
    );
}
