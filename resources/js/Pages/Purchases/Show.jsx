import React from 'react';
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {faArrowLeft, faPrint} from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import {router} from "@inertiajs/core";
import BorderButton from "@/Components/BorderButton.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Show = ({ purchase }) => {
    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Purchase Details</h2>
                    <PrimaryIconLink href={route('purchases.index')} icon={faArrowLeft}>Back to Purchases</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Purchase Details" />

            <div className="mx-auto max-w-[96%] py-6">
                <div className="p-6 bg-white shadow-md rounded-md">
                    <div className='flex justify-end mb-6'>
                        <BorderButton onClick={() => router.visit(route('purchases.invoices.show', purchase.id))}>
                            <FontAwesomeIcon icon={faPrint} className='mr-2' />
                            Print Invoice
                        </BorderButton>
                    </div>
                    <div className='flex bg-gray-100 p-4 rounded'>
                        <div className='w-1/2'>
                            <h3 className="text-xl font-semibold mb-2">Purchase Information</h3>
                            <p><strong>Total Price:</strong> {purchase.total_price} Rs</p>
                            <p><strong>Purchase Date:</strong> {purchase.purchase_date}</p>
                            <p><strong>Due Date:</strong> {purchase.due_date}</p>
                            <p className='capitalize'><strong>Payment Method:</strong> {purchase.payment_method}</p>
                        </div>
                        <div className='w-1/2'>
                            <h3 className="text-xl font-semibold mb-2">Supplier Details</h3>
                            <p><strong>Name:</strong> {purchase.supplier.name}</p>
                            <p><strong>Email:</strong> {purchase.supplier.email}</p>
                            <p><strong>Phone:</strong> {purchase.supplier.phone}</p>
                        </div>
                    </div>

                    {purchase.account && (
                        <p><strong>Account:</strong> {purchase.account.name}</p>
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
                            {purchase.products.map((product, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 border">{product.name}</td>
                                    <td className="px-4 py-2 border capitalize">{product.product_type}</td>
                                    <td className="px-4 py-2 border">
                                        {product.product_type === 'item' ? product.pivot.quantity : '-'}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {product.product_type === 'weight' ? product.pivot.weight : '-'}
                                    </td>
                                    <td className="px-4 py-2 border">{product.pivot.purchase_price} Rs</td>
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
