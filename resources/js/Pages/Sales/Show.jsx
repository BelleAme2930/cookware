import React from 'react';
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {faArrowLeft, faPrint} from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import {router} from "@inertiajs/core";
import IconButton from "@/Components/IconButton.jsx";
import BorderButton from "@/Components/BorderButton.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Show = ({ sale }) => {
    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Sale Details</h2>
                    <PrimaryIconLink href={route('sales.index')} icon={faArrowLeft}>Back to Sales</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Sale Details" />

            <div className="mx-auto max-w-[90%] py-6">
                <div className="p-6 bg-white shadow-md rounded-md">
                    <div className='flex justify-end mb-6'>
                        <BorderButton onClick={() => router.visit(route('sales.invoices.show', sale.id))}>
                            <FontAwesomeIcon icon={faPrint} className='mr-2' />
                            Print Invoice
                        </BorderButton>
                    </div>
                    <div className='flex bg-gray-100 p-4 rounded'>
                        <div className='w-1/2'>
                            <h3 className="text-xl font-semibold mb-2">Sale Information</h3>
                            <p><strong>Total Price:</strong> {sale.total_price} Rs</p>
                            <p><strong>Sale Date:</strong> {sale.sale_date}</p>
                            <p><strong>Due Date:</strong> {sale.due_date}</p>
                            <p className='capitalize'><strong>Payment Method:</strong> {sale.payment_method}</p>
                        </div>
                        <div className='w-1/2'>
                            <h3 className="text-xl font-semibold mb-2">Customer Details</h3>
                            <p><strong>Name:</strong> {sale.customer.name}</p>
                            <p><strong>Email:</strong> {sale.customer.email}</p>
                            <p><strong>Phone:</strong> {sale.customer.phone}</p>
                        </div>
                    </div>

                    {sale.account && (
                        <p><strong>Account:</strong> {sale.account.name}</p>
                    )}

                    <hr className="my-4"/>

                    <h3 className="text-xl font-semibold mb-4">Products</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                            <tr>
                                <th className="px-4 py-2 border">Product Name</th>
                                <th className="px-4 py-2 border">Type</th>
                                <th className="px-4 py-2 border">Quantity</th>
                                <th className="px-4 py-2 border">Weight (kg)</th>
                                <th className="px-4 py-2 border">Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sale.products.map((product, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 border">{product.name}</td>
                                    <td className="px-4 py-2 border capitalize">{product.product_type}</td>
                                    <td className="px-4 py-2 border">
                                        {product.product_type === 'item' ? product.pivot.quantity : '-'}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {product.product_type === 'weight' ? product.pivot.weight : '-'}
                                    </td>
                                    <td className="px-4 py-2 border">{product.pivot.sale_price} Rs</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
