import React from 'react';
import {Head} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {faArrowLeft, faPrint} from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import {router} from "@inertiajs/core";
import BorderButton from "@/Components/BorderButton.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Show = ({purchase, products}) => {
    console.log(purchase)

    const paymentMethods = purchase.payment_method;

    const isCredit = paymentMethods.includes('credit');
    const isAccount = paymentMethods.includes('account');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-lg leading-tight text-gray-800">Purchase Details</h2>
                    <PrimaryIconLink href={route('purchases.index')} icon={faArrowLeft}>
                        Back to Purchases
                    </PrimaryIconLink>
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

                    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                            Purchase Information
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <p>
                            <span
                                className="font-semibold">Purchase Date:</span> {new Date(purchase.purchase_date).toLocaleDateString()}
                            </p>
                            <p>
                                <span className="font-semibold">Supplier Name:</span> {purchase.supplier.name}
                            </p>
                            <p className='capitalize'>
                                <span className="font-semibold">Payment Method:</span> {paymentMethods.join(', ')}
                            </p>
                            {purchase.supplier.phone && (
                            <p>
                                <span
                                    className="font-semibold">Contact Number:</span> {purchase.supplier.phone}
                            </p>
                            )}
                            {isCredit && (
                                <>
                                    {/*<p>*/}
                                    {/*<span*/}
                                    {/*    className="font-semibold">Amount Paid:</span> {purchase.amount_paid.toLocaleString()} Rs*/}
                                    {/*</p>*/}
                                    {/*<p>*/}
                                    {/*<span*/}
                                    {/*    className="font-semibold">Credit Balance:</span> {purchase.remaining_balance.toLocaleString()} Rs*/}
                                    {/*</p>*/}
                                    <p>
                                    <span
                                        className="font-semibold">Due Date:</span> {new Date(purchase.due_date).toLocaleDateString() ?? '-'}
                                    </p>
                                </>
                            )}
                            {isAccount && (
                                <p>
                                <span
                                    className="font-semibold">Account:</span> {purchase.account?.title + ' - ' + purchase.account?.bank_name ?? 'N/A'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Purchase Information */}
                    {/*<div className="flex bg-gray-100 p-4 rounded">*/}
                    {/*    <div className='w-full md:w-1/2'>*/}
                    {/*        <h3 className="text-xl font-semibold mb-2">Purchase Information</h3>*/}
                    {/*        <p className='mb-1'><strong>Purchase*/}
                    {/*            Date:</strong> {new Date(purchase.purchase_date).toLocaleDateString()}</p>*/}
                    {/*        <p className='mb-1 capitalize'><strong>Payment Method:</strong> {paymentMethods.join(', ')}*/}
                    {/*        </p>*/}

                    {/*        {purchase.supplier && (*/}
                    {/*            <div className='mt-8'>*/}
                    {/*                <h3 className="text-xl font-semibold mb-2">Supplier Details</h3>*/}
                    {/*                <p className='mb-1'><strong>Name:</strong> {purchase.supplier.name}</p>*/}
                    {/*                {purchase.supplier.phone && (*/}
                    {/*                    <p className='mb-1'><strong>Phone:</strong> {purchase.supplier.phone}</p>*/}
                    {/*                )}*/}
                    {/*                {purchase.supplier.email && (*/}
                    {/*                    <p className='mb-1'><strong>Email:</strong> {purchase.supplier.email}</p>*/}
                    {/*                )}*/}
                    {/*                {purchase.supplier.email && (*/}
                    {/*                    <p className='mb-1'><strong>Address:</strong> {purchase.supplier.address}</p>*/}
                    {/*                )}*/}
                    {/*            </div>*/}
                    {/*        )}*/}
                    {/*    </div>*/}
                    {/*    <div className='w-full md:w-1/2'>*/}
                    {/*        <div>*/}
                    {/*            {paymentMethods.includes('cheque') && (purchase.cheque_details) && (*/}
                    {/*                <div className='mb-6'>*/}
                    {/*                    <div>*/}
                    {/*                        <h3 className="text-xl font-semibold mb-2">Cheque Details</h3>*/}
                    {/*                        <p className='mb-1'><strong>Cheque*/}
                    {/*                            Number:</strong> {purchase.cheque_details.cheque_number}*/}
                    {/*                        </p>*/}
                    {/*                        <p className='mb-1'><strong>Cheque*/}
                    {/*                            Bank:</strong> {purchase.cheque_details.cheque_bank}*/}
                    {/*                        </p>*/}
                    {/*                        <p className='mb-1'><strong>Cheque*/}
                    {/*                            Date:</strong> {purchase.cheque_details.cheque_date}*/}
                    {/*                        </p>*/}
                    {/*                        <p className='mb-1'><strong>Cheque*/}
                    {/*                            Amount:</strong> {purchase.cheque_details.cheque_amount} Rs*/}
                    {/*                        </p>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            )}*/}
                    {/*            {paymentMethods.includes('account') && (purchase.account) && (*/}
                    {/*                <div className='mb-6'>*/}
                    {/*                    <div>*/}
                    {/*                        <h3 className="text-xl font-semibold mb-2">Account Details</h3>*/}
                    {/*                        <p className='mb-1'>*/}
                    {/*                            <strong>Account:</strong> {purchase.account.title + ' - ' + purchase.account.bank_name}*/}
                    {/*                        </p>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            )}*/}
                    {/*            {paymentMethods.includes('credit') && (purchase.amount_paid) && (*/}
                    {/*                <div className='mb-6'>*/}
                    {/*                    <div>*/}
                    {/*                        <h3 className="text-xl font-semibold mb-2">Credit Details</h3>*/}
                    {/*                        <p className='mb-1'><strong>Amount*/}
                    {/*                            Paid:</strong> {purchase.amount_paid.toLocaleString()} Rs*/}
                    {/*                        </p>*/}
                    {/*                        <p className='mb-1'><strong>Credit*/}
                    {/*                            Balance:</strong> {purchase.remaining_balance.toLocaleString()} Rs</p>*/}
                    {/*                        {existingPrice > 0 && (*/}
                    {/*                            <p className='mb-1'><strong className='text-primary-600'>Existing*/}
                    {/*                                Balance:</strong> {existingPrice.toLocaleString()} Rs*/}
                    {/*                            </p>*/}
                    {/*                        )}*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            )}*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <div className="overflow-x-auto">
                        <h3 className="text-xl font-semibold mb-4">Products:</h3>
                        <table className="min-w-full bg-white border border-gray-200">
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

                            {[...new Set(purchase.product_items
                                .filter(item => {
                                    const product = products.find(p => p.id === item.product_id);
                                    return product && product.product_type === 'weight';
                                })
                                .map(item => item.batch_id))].map(batchId => {

                                const groupedItems = purchase.product_items.filter(item => item.batch_id === batchId);
                                const product = products.find(p => p.id === groupedItems[0].product_id);

                                const totalQuantity = groupedItems.reduce((sum, item) => sum + item.quantity, 0);
                                const totalPrice = groupedItems.reduce((sum, item) => sum + item.quantity * item.purchase_price, 0);

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
                                        <td className="py-2 px-4 border">{groupedItems[0].purchase_price.toLocaleString()} Rs</td>
                                        <td className="py-2 px-4 border">{(groupedItems[0].weight * groupedItems[0].purchase_price).toLocaleString()} Rs</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div className='mt-4 text-right py-4'>
                        <div>
                            {/*<p className="text-lg mb-2">*/}
                            {/*    <span className='font-semibold'>Sub Total: </span><span*/}
                            {/*    className="text-gray-900 font-medium">{purchase.total_price.toLocaleString()} Rs</span>*/}
                            {/*</p>*/}
                            <p className="text-lg mb-2">
                                <span className='font-semibold'>Total Bill: </span><span
                                className="text-gray-900 font-medium">{purchase.total_price.toLocaleString()} Rs</span>
                            </p>
                            <p className="text-lg mb-2">
                                <span className='font-semibold'>Previous Balance: </span><span
                                className="text-gray-900 font-medium">{purchase.supplier.existing_balance.toLocaleString()} Rs</span>
                            </p>
                            <p className="text-lg mb-2">
                                <span className='font-semibold'>Amount Paid: </span><span
                                className="text-gray-900 font-medium">{purchase.amount_paid.toLocaleString()} Rs</span>
                            </p>
                        </div>
                        <div className="border-t border-gray-300 my-2"></div>
                        <p className="text-xl font-bold text-gray-800">
                            Total Amount: <span
                            className="text-green-600">
                            {(Number(purchase.amount_paid) + Number(purchase.supplier.existing_balance)).toLocaleString()} Rs</span>
                        </p>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
