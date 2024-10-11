import React from 'react';
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { faArrowLeft, faPrint } from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import { router } from "@inertiajs/core";
import BorderButton from "@/Components/BorderButton.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Show = ({ purchase }) => {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-lg leading-tight text-gray-800">Purchase Details</h2>
                    <PrimaryIconLink href={route('purchases.index')} icon={faArrowLeft}>Back to Purchases</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Purchase Details" />

            <div className="mx-auto max-w-[96%] py-6">
                <div className="p-6 bg-white shadow-md rounded-md">
                    <div className="flex justify-end mb-6">
                        <BorderButton onClick={() => router.visit(route('purchases.invoices.show', purchase.id))}>
                            <FontAwesomeIcon icon={faPrint} className="mr-2" />
                            Print Invoice
                        </BorderButton>
                    </div>

                    {/* Purchase and Supplier Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-100 p-4 rounded">
                        {/* Purchase Information */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Purchase Information</h3>
                            <p className='mb-1'><strong>Total Price:</strong> {purchase.total_price.toLocaleString()} Rs</p>
                            <p className='mb-1'><strong>Purchase Date:</strong> {purchase.purchase_date}</p>
                            {purchase.due_date && (
                            <p className='mb-1'><strong>Due Date:</strong> {purchase.due_date || 'N/A'}</p>
                            )}
                            <p className='mb-1'><strong>Payment Method:</strong> {purchase.payment_method}</p>
                            <p className='mb-1'><strong>Remaining Balance:</strong> {purchase.remaining_balance} Rs</p>
                            {purchase.credit_amount !== null && (
                                <p><strong>Credit Amount:</strong> {purchase.credit_amount} Rs</p>
                            )}
                        </div>

                        {/* Supplier Information */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Supplier Details</h3>
                            <p className='mb-1'><strong>Name:</strong> {purchase.supplier.name}</p>
                            <p className='mb-1'><strong>Email:</strong> {purchase.supplier.email}</p>
                            <p className='mb-1'><strong>Phone:</strong> {purchase.supplier.phone}</p>
                            <p className='mb-1'><strong>Address:</strong> {purchase.supplier.address}</p>
                        </div>
                    </div>

                    {/* Account Information */}
                    {purchase.account_id && (
                        <p className="mt-4"><strong>Account:</strong> {purchase.account.name}</p>
                    )}

                    <hr className="my-6" />

                    {/* Product List */}
                    <h3 className="text-xl font-semibold mb-4">Products</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 border">Product Name</th>
                                <th className="px-4 py-2 border">Type</th>
                                <th className="px-4 py-2 border">Quantity</th>
                                <th className="px-4 py-2 border">Weight</th>
                                <th className="px-4 py-2 border">Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {purchase.products.map((product, index) => (
                                <tr key={index} className="text-center">
                                    <td className="px-4 py-2 border">{product.name}</td>
                                    <td className="px-4 py-2 border capitalize">{product.product_type}</td>
                                    <td className="px-4 py-2 border">
                                        {product.pivot.quantity}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {product.pivot.weight + ' KG'}
                                    </td>
                                    <td className="px-4 py-2 border">{product.pivot.purchase_price.toLocaleString()} Rs</td>
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
