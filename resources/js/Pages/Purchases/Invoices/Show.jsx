import React from 'react';
import { Head } from "@inertiajs/react";
import Button from "@/Components/Button.jsx";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Invoice = ({ purchase, products }) => {
    const paymentMethods = purchase.payment_method;

    const isCredit = paymentMethods.includes('credit') || paymentMethods.includes('cash_credit');
    const isAccount = paymentMethods.includes('account') || paymentMethods.includes('cash_account');

    const isItemType = purchase.product_items.some(item => {
        const product = products.find(p => p.id === item.product_id);
        return product && product.product_type === 'item';
    });

    const isWeightType = purchase.product_items.some(item => {
        const product = products.find(p => p.id === item.product_id);
        return product && product.product_type === 'weight';
    });

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <Head title={`Invoice - Purchase #INV-P-${purchase.id}`} />

            <div className='mb-3 print:hidden'>
                <PrimaryIconLink href={route('dashboard')} icon={faArrowLeft}>
                    Back to Dashboard
                </PrimaryIconLink>
            </div>

            <div className="max-w-[2480px] w-[90%] mx-auto p-6 bg-white shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <img src="/assets/images/logo.png" alt="Company Logo" className="h-16 w-auto" />
                    <h2 className="text-xl font-bold text-gray-800">
                        Invoice: INV-P-{purchase.id}
                    </h2>
                </div>

                <div className="mb-6">
                    <p className="text-md text-gray-800">
                        <span className="font-bold">Invoice ID: </span> INV-P-{purchase.id}
                    </p>
                    <p className="text-md text-gray-800">
                        <span className="font-bold">Purchase Date:</span> {new Date(purchase.purchase_date).toLocaleDateString()}
                    </p>
                    <p className="text-md text-gray-800">
                        <span className="font-bold">Supplier:</span> {purchase.supplier.name}
                    </p>
                    <p className="text-md text-gray-800 capitalize">
                        <span className="font-bold">Payment Method:</span> {paymentMethods.join(', ')}
                    </p>

                    {/* Conditional Payment Info */}
                    {isCredit && (
                        <>
                            <p className="text-md text-gray-800">
                                <span className="font-bold">Amount Paid:</span> {purchase.amount_paid.toLocaleString()} Rs
                            </p>
                            <p className="text-md text-gray-800">
                                <span className="font-bold">Remaining Balance:</span> {purchase.remaining_balance.toLocaleString()} Rs
                            </p>
                            <p className="text-md text-gray-800">
                                <span className="font-bold">Due Date:</span> {new Date(purchase.due_date).toLocaleDateString() ?? '-'}
                            </p>
                        </>
                    )}

                    {isAccount && (
                        <p className="text-md text-gray-800">
                            <span className="font-bold">Account:</span> {purchase.account?.title + ' - ' + purchase.account?.bank_name ?? 'N/A'}
                        </p>
                    )}
                </div>

                {/* Product Table */}
                <table className="w-full text-left table-auto border-collapse border">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold">Product</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Size</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Quantity/Weight</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Rate</th>
                        <th className="px-4 py-2 text-gray-700 border border-gray-300 font-semibold text-center">Total Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {purchase.product_items.map((item) => {
                        const product = products.find(p => p.id === item.product_id);

                        // Item Type Product
                        if (product && product.product_type === 'item') {
                            const size = product.sizes.find(s => s.id === item.product_size_id);
                            const totalPrice = item.purchase_price * item.quantity;

                            return (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-2 border border-gray-300">{product.name}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{size ? size.size : '-'}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{item.quantity} Pcs</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{item.purchase_price.toLocaleString()} Rs</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{totalPrice.toLocaleString()} Rs</td>
                                </tr>
                            );
                        }

                        // Weight Type Product
                        if (product && product.product_type === 'weight') {
                            const sizeInfo = product.sizes.map(size => {
                                const quantity = purchase.product_items.filter(i => i.product_size_id === size.id).reduce((total, i) => total + i.quantity, 0);
                                return (
                                    <div key={size.id} className="flex flex-col justify-center items-center gap-1">
                                        <div className="border-b border-black px-2">{size.size}</div>
                                        <div>{quantity}</div>
                                    </div>
                                );
                            });

                            const totalPrice = item.purchase_price * item.weight;

                            return (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-2 border border-gray-300">{product.name}</td>
                                    <td className="px-4 py-2 border border-gray-300">
                                        <div className="flex justify-center items-center gap-3">
                                            {sizeInfo}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{item.weight} KG</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{item.purchase_price.toLocaleString()} Rs</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{totalPrice.toLocaleString()} Rs</td>
                                </tr>
                            );
                        }

                        return null;
                    })}
                    </tbody>
                </table>

                {/* Total Price */}
                <div className="mt-6 text-right">
                    <p className="text-xl font-bold">Total Price: {purchase.total_price.toLocaleString()} Rs</p>
                </div>

                {/* Footer */}
                <div className="mt-12">
                    <p className="text-md mb-1"><span className="font-semibold">LG Kitchenware Showroom</span></p>
                    <p className="text-md mb-1">
                        <span className="font-semibold">Address:</span> Muslim Road, Opposite Mini Stadium, Gujranwala
                    </p>
                    <p className="text-md mb-1">
                        <span className="font-semibold">Phone:</span> 055-4441095
                    </p>
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
