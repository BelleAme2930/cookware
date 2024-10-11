import React from 'react';
import { Head } from "@inertiajs/react";
import Button from "@/Components/Button.jsx";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";

const Invoice = ({ sale }) => {
    const isCredit = ['credit', 'half_cash_half_credit', 'half_account_half_credit'].includes(sale.payment_method);
    const isAccount = ['account', 'half_cash_half_account', 'half_account_half_credit'].includes(sale.payment_method);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <Head title={`Invoice - Sale #INV-S-${sale.id}`} />

            <div className='mb-3 print:hidden'>
                <PrimaryIconLink href={route('dashboard')} icon={faArrowLeft}>Back to Dashboard</PrimaryIconLink>
            </div>

            <div className="max-w-[2480px] w-[90%] mx-auto p-6 bg-white shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <img src="/assets/images/logo.png" alt="Company Logo" className="h-16 w-auto" />
                    <h2 className="text-xl font-bold text-gray-800">Invoice: INV-S-{sale.id}</h2>
                </div>

                <div className="mb-6">
                    {/* Invoice and Customer Info */}
                    <p className="text-md text-gray-800">
                        <span className="font-bold">Invoice ID: </span> INV-S-{sale.id}
                    </p>
                    <p className="text-md text-gray-800">
                        <span className="font-bold">Customer:</span> {sale.customer.name}
                    </p>
                    <p className="text-md text-gray-800">
                        <span className="font-bold">Phone:</span> {sale.customer.phone}
                    </p>
                    <p className="text-md text-gray-800">
                        <span className="font-bold">Email:</span> {sale.customer.email}
                    </p>
                    <p className="text-md text-gray-800">
                        <span className="font-bold">Date:</span> {sale.sale_date}
                    </p>
                    <p className="text-md text-gray-800">
                        <span className="font-bold">Payment Method:</span> {sale.payment_method}
                    </p>

                    {/* Conditional Payment Info */}
                    {isCredit && (
                        <>
                            <p className="text-md text-gray-800">
                                <span className="font-bold">Remaining Balance:</span> {sale.remaining_balance} Rs
                            </p>
                            <p className="text-md text-gray-800">
                                <span className="font-bold">Due Date:</span> {sale.due_date ?? 'N/A'}
                            </p>
                        </>
                    )}

                    {isAccount && (
                        <p className="text-md text-gray-800">
                            <span className="font-bold">Account Title:</span> {sale.account?.title ?? 'N/A'}
                        </p>
                    )}
                </div>

                {/* Product Table */}
                <table className="w-full text-left table-auto border-collapse border">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold">Product</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Quantity</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Weight (kg)</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Price per Unit</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sale.products.map((product) => (
                        <tr key={product.id} className="border-t">
                            <td className="px-4 py-2 border border-gray-300">{product.name}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center">{product.pivot.quantity ?? '-'}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center">{product.pivot.weight ?? '-'}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center">{product.pivot.sale_price.toLocaleString()} Rs</td>
                            <td className="px-4 py-2 border border-gray-300 text-center">
                                {product.product_type === 'weight'
                                    ? (product.pivot.sale_price * product.pivot.weight).toLocaleString()
                                    : (product.pivot.sale_price * product.pivot.quantity).toLocaleString()} Rs
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Total Price */}
                <div className="mt-6 text-right">
                    <p className="text-xl font-bold">Total Price: {sale.total_price.toLocaleString()} Rs</p>
                </div>

                {/* Footer */}
                <div className="mt-12">
                    <p className="text-md mb-1"><span className="font-semibold">LG Kitchenware Showroom</span></p>
                    <p className="text-md mb-1"><span className="font-semibold">Address:</span> Muslim Road, Opposite Mini Stadium, Gujranwala</p>
                    <p className="text-md mb-1"><span className="font-semibold">Phone:</span> 055-4441095, 055-4298990</p>
                </div>

                {/* Print Button */}
                <div className='flex items-center justify-center mt-4 print:hidden'>
                    <Button onClick={() => window.print()}>
                        Print Invoice
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
