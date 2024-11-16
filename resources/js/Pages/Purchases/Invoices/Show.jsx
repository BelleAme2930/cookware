import React from 'react';
import { Head } from "@inertiajs/react";
import Button from "@/Components/Button.jsx";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Invoice = ({ purchase, products }) => {

    console.log(purchase)

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
                <PrimaryIconLink href={route('purchases.index')} icon={faArrowLeft}>
                    Back to purchases
                </PrimaryIconLink>
            </div>

            <div className="max-w-[2480px] w-[90%] mx-auto p-6 bg-white shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <img src="/assets/images/logo.png" alt="Company Logo" className="h-16 w-auto"/>
                    <h2 className="text-xl font-bold text-gray-800">
                        Invoice: INV-P-{purchase.id}
                    </h2>
                </div>

                <div className="mb-6">
                    <p className="text-md text-gray-800">
                        <span className="font-bold">Invoice ID: </span> INV-P-{purchase.id}
                    </p>
                    <p className="text-md text-gray-800">
                        <span
                            className="font-bold">Purchase Date:</span> {new Date(purchase.purchase_date).toLocaleDateString()}
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
                                <span
                                    className="font-bold">Amount Paid:</span> {purchase.amount_paid.toLocaleString()} Rs
                            </p>
                            <p className="text-md text-gray-800">
                                <span
                                    className="font-bold">Remaining Credit Balance:</span> {purchase.remaining_balance.toLocaleString()} Rs
                            </p>
                            <p className="text-md text-gray-800">
                                <span
                                    className="font-bold">Due Date:</span> {new Date(purchase.due_date).toLocaleDateString() ?? '-'}
                            </p>
                            <p className='mb-1'><strong className='text-primary-600'>Existing Balance
                                for {purchase.supplier.name}:</strong> {purchase.remaining_balance.toLocaleString()} Rs
                            </p>

                        </>
                    )}

                    {isAccount && (
                        <p className="text-md text-gray-800">
                            <span
                                className="font-bold">Account:</span> {purchase.account?.title + ' - ' + purchase.account?.bank_name ?? 'N/A'}
                        </p>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto border-collapse border">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 text-center border">Product Name</th>
                            <th className="py-2 px-4 text-center border">Size</th>
                            <th className="py-2 px-4 text-center border">Quantity</th>
                            <th className="py-2 px-4 text-center border">Weight</th>
                            <th className="py-2 px-4 text-center border">Rate (Rs)</th>
                            <th className="py-2 px-4 text-center border">Total Price (Rs)</th>
                        </tr>
                        </thead>
                        <tbody>

                        {purchase.product_items
                            .filter(item => {
                                const product = products.find(p => p.id === item.product_id);
                                return product && product.product_type === 'item';
                            })
                            .map(item => {
                                const product = products.find(p => p.id === item.product_id);
                                return (
                                    <tr key={item.id} className="text-center">
                                        <td className="py-2 px-4 border">{product.name}</td>
                                        <td className="py-2 px-4 border">
                                            {product.sizes.find(size => size.id === item.product_size_id)?.size || '-'}
                                        </td>
                                        <td className="py-2 px-4 border">{item.quantity}</td>
                                        <td className="py-2 px-4 border">-</td>
                                        <td className="py-2 px-4 border">{item.purchase_price.toLocaleString()} Rs</td>
                                        <td className="py-2 px-4 border">{(item.quantity * item.purchase_price).toLocaleString()} Rs</td>
                                    </tr>
                                );
                            })}

                        {/* Render each unique "item" type product as a single row */}
                        {[...new Set(purchase.product_items
                            .filter(item => {
                                const product = products.find(p => p.id === item.product_id);
                                return product && product.product_type === 'weight';
                            })
                            .map(item => item.product_id))].map(productId => {
                            // Group all items by this unique product_id
                            const groupedItems = purchase.product_items.filter(item => item.product_id === productId);
                            const product = products.find(p => p.id === productId);

                            const totalQuantity = groupedItems.reduce((sum, item) => sum + item.quantity, 0);

                            return (
                                <tr key={product.id} className="text-center">
                                    <td className="py-2 px-4 border">{product.name}</td>
                                    <td className="py-2 px-4 border">
                                        {product.sizes.length > 0 ? (
                                            <div className='flex justify-center gap-3'>
                                                {groupedItems.map(item => {
                                                    const size = product.sizes.find(size => size.id === item.product_size_id);
                                                    return (
                                                        <>
                                                            <div className='flex'>
                                                                {size && (
                                                                    <div>
                                                                        <div
                                                                            className='border-b border-black'>{size.size}</div>
                                                                        <div>{item.quantity}</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </>
                                                    );
                                                })}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="py-2 px-4 border">{totalQuantity}</td>
                                    <td className="py-2 px-4 border">{groupedItems[0].weight.toLocaleString()} KG</td>
                                    <td className="py-2 px-4 border">{groupedItems[0].purchase_price.toLocaleString()} Rs</td>
                                    <td className="py-2 px-4 border">{groupedItems[0].weight * groupedItems[0].purchase_price.toLocaleString()} Rs</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* Total Price */}
                <div className="mt-6 text-right">
                    <p className="text-xl font-bold">Total Price: {(purchase.total_price + purchase.remaining_balance).toLocaleString()} Rs</p>
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
