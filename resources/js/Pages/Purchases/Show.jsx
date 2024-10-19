import React from 'react';
import {Head} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {faArrowLeft, faPrint} from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import {router} from "@inertiajs/core";
import BorderButton from "@/Components/BorderButton.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Show = ({purchase}) => {
    console.log(purchase)
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-lg leading-tight text-gray-800">Purchase Details</h2>
                    <PrimaryIconLink href={route('purchases.index')} icon={faArrowLeft}>Back to
                        Purchases</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Purchase Details"/>

            <div className="mx-auto max-w-[96%] py-6">
                <div className="p-6 bg-white shadow-md rounded-md">
                    <div className="flex justify-end mb-6">
                        <BorderButton onClick={() => router.visit(route('purchases.invoices.show', purchase.id))}>
                            <FontAwesomeIcon icon={faPrint} className="mr-2"/>
                            Print Invoice
                        </BorderButton>
                    </div>

                    {/* Purchase and Supplier Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-100 p-4 rounded">
                        {/* Purchase Information */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Purchase Information</h3>
                            <p className='mb-1'><strong>Total Price:</strong> {purchase.total_price.toLocaleString()} Rs
                            </p>
                            <p className='mb-1'><strong>Purchase
                                Date:</strong> {new Date(purchase.purchase_date).toLocaleDateString()}</p>
                            {purchase.due_date && (
                                <p className='mb-1'><strong>Due
                                    Date:</strong> {new Date(purchase.due_date).toLocaleDateString()}</p>
                            )}
                            <p className='mb-1'><strong>Payment Method:</strong> {purchase.payment_method}</p>
                            <p className='mb-1'><strong>Remaining
                                Balance:</strong> {purchase.remaining_balance.toLocaleString()} Rs</p>
                            {purchase.credit_amount !== null && (
                                <p><strong>Credit Amount:</strong> {purchase.credit_amount.toLocaleString()} Rs</p>
                            )}
                        </div>

                        {/* Supplier Information */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Supplier Details</h3>
                            <p className='mb-1'><strong>Name:</strong> {purchase.supplier.name}</p>
                            {purchase.supplier.email && (
                                <p className='mb-1'><strong>Email:</strong> {purchase.supplier.email}</p>
                            )}
                            {purchase.supplier.phone && (
                                <p className='mb-1'><strong>Phone:</strong> {purchase.supplier.phone}</p>
                            )}
                            {purchase.supplier.address && (
                                <p className='mb-1'><strong>Address:</strong> {purchase.supplier.address}</p>
                            )}
                        </div>
                    </div>

                    {/* Account Information */}
                    {purchase.account_id && (
                        <p className="mt-4"><strong>Account:</strong> {purchase.account.name}</p>
                    )}

                    <hr className="my-6"/>

                    {/* Product List */}
                    <h3 className="text-xl font-semibold mb-4">Products</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 border">Product Name</th>
                                <th className="px-4 py-2 border">Sizes</th>
                                <th className="px-4 py-2 border">Total Quantity</th>
                                <th className="px-4 py-2 border">Total Weight</th>
                                <th className="px-4 py-2 border">Total Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {purchase.products.map((product, index) => {
                                const totalPrice = product.sizes.reduce((acc, size) => {
                                    const purchaseSize = purchase.product_sizes.find(ps => ps.product_id === product.id && ps.id === size.id);
                                    if (purchaseSize && purchaseSize.quantity > 0) {
                                        return acc + (purchaseSize.quantity * purchaseSize.purchase_price);
                                    }
                                    return acc;
                                }, 0);

                                return (
                                    <tr key={index} className="text-center">
                                        <td className="px-4 py-2 border">{product.name}</td>
                                        <td className="px-4 py-2 border">
                                            <div className='flex flex-wrap gap-2 justify-center'>
                                                {product.sizes.map((size) => {
                                                    const purchaseSize = purchase.product_sizes.find(ps => ps.id === size.id);
                                                    return (
                                                        <>
                                                            {size.size && purchaseSize && purchaseSize.quantity > 0 && (
                                                                <div key={size.id}>
                                                                    <div
                                                                        className='font-medium text-gray-700 border-b border-black'>{size.size}</div>
                                                                    <div
                                                                        className='font-medium text-gray-700'>{purchaseSize.quantity}</div>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 border">{product.pivot.quantity}</td>
                                        <td className="px-4 py-2 border">{product.product_type === 'weight' ? product.pivot.weight + ' KG' : '-'}</td>
                                        <td className="px-4 py-2 border">{totalPrice.toLocaleString()} Rs</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
