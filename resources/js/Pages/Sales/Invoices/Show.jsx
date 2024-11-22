import React from 'react';
import {Head} from "@inertiajs/react";
import Button from "@/Components/Button.jsx";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

const Invoice = ({sale, products}) => {
    console.log(sale)

    const paymentMethods = sale.payment_method;

    const isCredit = paymentMethods.includes('credit');
    const isAccount = paymentMethods.includes('account');

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <Head title={`Invoice - Sale #INV-P-${sale.id}`}/>

            <div className='mb-3 print:hidden'>
                <PrimaryIconLink href={route('sales.index')} icon={faArrowLeft}>
                    Back to sales
                </PrimaryIconLink>
            </div>

            <div className="max-w-[2480px] w-[90%] mx-auto p-6 bg-white shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <img src="/assets/images/logo.png" alt="Company Logo" className="h-16 w-auto"/>
                    <h2 className="text-xl font-bold text-gray-800">
                        Invoice: INV-P-{sale.id}
                    </h2>
                </div>
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                        Invoice Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <p>
                            <span className="font-semibold">Invoice ID:</span> INV-S-{sale.id}
                        </p>
                        <p>
                            <span
                                className="font-semibold">Sale Date:</span> {new Date(sale.sale_date).toLocaleDateString()}
                        </p>
                        <p>
                            <span className="font-semibold">Customer:</span> {sale.customer.name}
                        </p>
                        <p className='capitalize'>
                            <span className="font-semibold">Payment Method:</span> {paymentMethods.join(', ')}
                        </p>
                        {isCredit && (
                            <>
                                <p>
                                    <span
                                        className="font-semibold">Amount Paid:</span> {sale.amount_paid.toLocaleString()} Rs
                                </p>
                                <p>
                                    <span
                                        className="font-semibold">Credit Balance:</span> {sale.remaining_balance.toLocaleString()} Rs
                                </p>
                                <p>
                                    <span
                                        className="font-semibold">Due Date:</span> {new Date(sale.due_date).toLocaleDateString() ?? '-'}
                                </p>
                            </>
                        )}
                        {isAccount && (
                            <p>
                                <span
                                    className="font-semibold">Account:</span> {sale.account?.title + ' - ' + sale.account?.bank_name ?? 'N/A'}
                            </p>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto border-collapse border">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 text-center border">Product Name</th>
                            <th className="py-2 px-4 text-center border">Size</th>
                            <th className="py-2 px-4 text-center border">Quantity</th>
                            <th className="py-2 px-4 text-center border">Weight</th>
                            <th className="py-2 px-4 text-center border">Rate</th>
                            <th className="py-2 px-4 text-center border">Total Price</th>
                        </tr>
                        </thead>
                        <tbody>

                        {sale.product_items
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
                                        <td className="py-2 px-4 border">{item.sale_price.toLocaleString()} Rs</td>
                                        <td className="py-2 px-4 border">{(item.quantity * item.sale_price).toLocaleString()} Rs</td>
                                    </tr>
                                );
                            })}

                        {/*{[...new Set(sale.product_items*/}
                        {/*    .filter(item => {*/}
                        {/*        const product = products.find(p => p.id === item.product_id);*/}
                        {/*        return product && product.product_type === 'weight';*/}
                        {/*    })*/}
                        {/*    .map(item => item.product_id))].map(productId => {*/}
                        {/*    // Group all items by this unique product_id*/}
                        {/*    const groupedItems = sale.product_items.filter(item => item.product_id === productId);*/}
                        {/*    const product = products.find(p => p.id === productId);*/}

                        {/*    const totalQuantity = groupedItems.reduce((sum, item) => sum + item.quantity, 0);*/}

                        {/*    return (*/}
                        {/*        <tr key={product.id} className="text-center">*/}
                        {/*            <td className="py-2 px-4 border">{product.name}</td>*/}
                        {/*            <td className="py-2 px-4 border">*/}
                        {/*                {product.sizes.length > 0 ? (*/}
                        {/*                    <div className='flex justify-center gap-3'>*/}
                        {/*                        {groupedItems.map(item => {*/}
                        {/*                            const size = product.sizes.find(size => size.id === item.product_size_id);*/}
                        {/*                            return (*/}
                        {/*                                <>*/}
                        {/*                                    <div className='flex'>*/}
                        {/*                                        {size && (*/}
                        {/*                                            <div>*/}
                        {/*                                                <div*/}
                        {/*                                                    className='border-b border-black'>{size.size}</div>*/}
                        {/*                                                <div>{item.quantity}</div>*/}
                        {/*                                            </div>*/}
                        {/*                                        )}*/}
                        {/*                                    </div>*/}
                        {/*                                </>*/}
                        {/*                            );*/}
                        {/*                        })}*/}
                        {/*                    </div>*/}
                        {/*                ) : '-'}*/}
                        {/*            </td>*/}
                        {/*            <td className="py-2 px-4 border">{totalQuantity}</td>*/}
                        {/*            <td className="py-2 px-4 border">{groupedItems[0].weight.toLocaleString()} KG</td>*/}
                        {/*            <td className="py-2 px-4 border">{groupedItems[0].sale_price.toLocaleString()} Rs</td>*/}
                        {/*            <td className="py-2 px-4 border">{groupedItems[0].weight * groupedItems[0].sale_price.toLocaleString()} Rs</td>*/}
                        {/*        </tr>*/}
                        {/*    );*/}
                        {/*})}*/}

                        {[...new Set(sale.product_items
                            .filter(item => {
                                const product = products.find(p => p.id === item.product_id);
                                return product && product.product_type === 'weight';
                            })
                            .map(item => item.batch_id))].map(batchId => {

                            const groupedItems = sale.product_items.filter(item => item.batch_id === batchId);
                            const product = products.find(p => p.id === groupedItems[0].product_id);

                            const totalQuantity = groupedItems.reduce((sum, item) => sum + item.quantity, 0);
                            const totalPrice = groupedItems.reduce((sum, item) => sum + item.quantity * item.sale_price, 0);

                            return (
                                <tr key={batchId} className="text-center">
                                    <td className="py-2 px-4 border">{product.name}</td>
                                    <td className="py-2 px-4 border">
                                        {product.sizes.length > 0 ? (
                                            <div className="flex justify-center gap-3">
                                                {groupedItems.map(item => {
                                                    const size = product.sizes.find(size => size.id === item.product_size_id);
                                                    return (
                                                        <div key={item.id} className="flex">
                                                            {size && (
                                                                <div>
                                                                    <div
                                                                        className="border-b border-black">{size.size}</div>
                                                                    <div>{item.quantity}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="py-2 px-4 border">{totalQuantity}</td>
                                    <td className="py-2 px-4 border">{groupedItems[0].weight.toLocaleString()} KG</td>
                                    <td className="py-2 px-4 border">{groupedItems[0].sale_price.toLocaleString()} Rs</td>
                                    <td className="py-2 px-4 border">{(groupedItems[0].weight * groupedItems[0].sale_price).toLocaleString()} Rs</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* Total Price */}
                <div className='mt-4 text-right py-4'>
                    <div>
                        <p className="text-lg mb-2">
                            <span className='font-semibold'>Sub Total: </span><span
                            className="text-gray-900 font-medium">{sale.total_price.toLocaleString()} Rs</span>
                        </p>
                        <p className="text-lg mb-2">
                            <span className='font-semibold'>Existing Balance: </span><span
                            className="text-gray-900 font-medium">{sale.customer_old_balance.toLocaleString()} Rs</span>
                        </p>
                    </div>
                    <div className="border-t border-gray-300 my-2"></div>
                    <p className="text-xl font-bold text-gray-800">
                        Total Price: <span
                        className="text-green-600">
                            {(Number(sale.total_price) + Number(sale.customer_old_balance)).toLocaleString()} Rs</span>
                    </p>

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
