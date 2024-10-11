import React from 'react';
import { Head } from "@inertiajs/react";
import Button from "@/Components/Button.jsx";

const Invoice = ({ purchase }) => {
    console.log(purchase)
    const isCredit = ['credit', 'half_cash_half_credit', 'half_account_half_credit'].includes(purchase.payment_method);
    const isAccount = ['account', 'half_cash_half_account', 'half_account_half_credit'].includes(purchase.payment_method);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <Head title={`Invoice - Purchase #INV-P-${purchase.id}`} />

            <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <img src="/assets/images/logo.png" alt="Company Logo" className="h-16 w-auto" />
                    <h2 className="text-xl font-bold text-gray-800">Invoice: INV-P-{purchase.id}</h2>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-600">
                        <span className="font-bold">Invoice ID: </span><span>INV-P-{purchase.id}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-bold">Supplier:</span> <span>{purchase.supplier.name}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-bold">Date:</span> {purchase.purchase_date}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-bold">Payment Method:</span> {purchase.payment_method}
                    </p>
                    {isCredit && (
                        <>
                            <p className="text-sm text-gray-600">
                                <span className="font-bold">Remaining Amount:</span> {purchase.remaining_balance} Rs
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-bold">Due Date:</span> {purchase.due_date}
                            </p>
                        </>
                    )}
                    {isAccount && (
                        <p className="text-sm text-gray-600">
                            <span className="font-bold">Account Title:</span> {purchase.account.title}
                        </p>
                    )}
                </div>

                <table className="w-full text-left table-auto border-collapse border">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold">Product</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Quantity</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Weight (kg)</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Price per KG</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {purchase.products.map((product) => (
                        <tr key={product.id} className="border-t">
                            <td className="px-4 py-2 border border-gray-300">{product.name}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center">{product.pivot.quantity ?? '-'}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center">{product.pivot.weight ?? '-'}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center">{product.pivot.purchase_price} Rs</td>
                            <td className="px-4 py-2 border border-gray-300 text-center">
                                {product.product_type === 'weight' ? product.pivot.purchase_price * product.pivot.weight : product.pivot.purchase_price * product.pivot.quantity} Rs</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="mt-6 text-right">
                    <p className="text-xl font-bold">Total Price: {purchase.total_price} Rs</p>
                </div>

                <div className="mt-12">
                    <p className="text-sm mb-1"><span className='font-semibold'>LG Kitchenware Showroom</span></p>
                    <p className="text-sm mb-1"><span className='font-semibold'>Address:</span> Muslim Road, Opposite Mini Stadium, Gujranwala</p>
                    <p className="text-sm mb-1"><span className='font-semibold'>Phone:</span> 055-4441095, 055-4298990</p>
                </div>

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
