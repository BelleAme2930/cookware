import React from 'react';
import { Head } from "@inertiajs/react";
import Button from "@/Components/Button.jsx";

const Invoice = ({ sale }) => {
    console.log(sale)
    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <Head title={`Invoice - Sale #INV-S-${sale.id}`} />

            <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">

                <div className="flex justify-between items-center mb-6">
                    <img src="/assets/images/logo.png" alt="Company Logo" className="h-16 w-auto" />
                    <h2 className="text-xl font-bold text-gray-800">Invoice: INV-S-{sale.id}</h2>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-600">
                        <span className="font-bold">Invoice ID: </span><span>INV-S-{sale.id}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-bold">Customer:</span> <span>{sale.customer.name}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-bold">Date:</span> {sale.sale_date}
                    </p>
                </div>

                <table className="w-full text-left table-auto border-collapse border">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold">Product</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Quantity</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Weight (kg)</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sale.products.map((product) => (
                        <tr key={product.id} className="border-t">
                            <td className="px-4 py-2 border border-gray-300">{product.name}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center">{product.product_type === 'item' ? product.pivot.quantity : '-'}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center">{product.product_type === 'weight' ? product.pivot.weight : '-'}</td>
                            <td className="px-4 py-2 border border-gray-300 text-center">{product.pivot.sale_price} Rs</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="mt-6 text-right">
                    <p className="text-xl font-bold">Total: {sale.total_price} Rs</p>
                </div>

                <div className="mt-12">
                    <p className="text-sm"><span className='font-semibold'>Bilal Shafique</span></p>
                    <p className="text-sm"><span className='font-semibold'>Address:</span> Muslim Road, Opposite Mini Stadium, Gujranwala</p>
                    <p className="text-sm"><span className='font-semibold'>Phone:</span> 055-4441095, 055-4298990</p>
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
