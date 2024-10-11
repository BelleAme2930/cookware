import React from 'react';
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { faArrowLeft, faPrint } from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import { router } from "@inertiajs/core";
import BorderButton from "@/Components/BorderButton.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Show = ({ sale }) => {
    console.log(sale);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-lg leading-tight text-gray-800">Sale Details</h2>
                    <PrimaryIconLink href={route('sales.index')} icon={faArrowLeft}>Back to Sales</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Sale Details" />

            <div className="mx-auto max-w-[96%] py-6">
                <div className="p-6 bg-white shadow-md rounded-md">
                    <div className="flex justify-end mb-6">
                        <BorderButton onClick={() => router.visit(route('sales.invoices.show', sale.id))}>
                            <FontAwesomeIcon icon={faPrint} className="mr-2" />
                            Print Invoice
                        </BorderButton>
                    </div>

                    {/* Sale and Customer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-100 p-4 rounded">
                        {/* Sale Information */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Sale Information</h3>
                            <p className='mb-1'><strong>Total Price:</strong> {sale.total_price.toLocaleString()} Rs</p>
                            <p className='mb-1'><strong>Sale Date:</strong> {sale.sale_date}</p>
                            {sale.due_date && (
                                <p className='mb-1'><strong>Due Date:</strong> {sale.due_date || 'N/A'}</p>
                            )}
                            <p className='mb-1'><strong>Payment Method:</strong> {sale.payment_method}</p>
                            <p className='mb-1'><strong>Remaining Balance:</strong> {sale.remaining_balance} Rs</p>
                        </div>

                        {/* Customer Information */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Customer Details</h3>
                            <p className='mb-1'><strong>Name:</strong> {sale.customer.name}</p>
                            <p className='mb-1'><strong>Email:</strong> {sale.customer.email}</p>
                            <p className='mb-1'><strong>Phone:</strong> {sale.customer.phone}</p>
                            <p className='mb-1'><strong>Address:</strong> {sale.customer.address}</p>
                        </div>
                    </div>

                    {/* Account Information */}
                    {sale.account_id && (
                        <p className="mt-4"><strong>Account:</strong> {sale.account.name}</p>
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
                            {sale.products.map((product, index) => (
                                <tr key={index} className="text-center">
                                    <td className="px-4 py-2 border">{product.name}</td>
                                    <td className="px-4 py-2 border capitalize">{product.product_type}</td>
                                    <td className="px-4 py-2 border">
                                        {product.pivot.quantity}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {product.pivot.weight + ' KG'}
                                    </td>
                                    <td className="px-4 py-2 border">{product.pivot.sale_price.toLocaleString()} Rs</td>
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
