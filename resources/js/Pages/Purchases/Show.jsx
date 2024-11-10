import React from 'react';
import {Head} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {faArrowLeft, faPrint} from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import {router} from "@inertiajs/core";
import BorderButton from "@/Components/BorderButton.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Show = ({purchase, products}) => {
    console.log(products)

    const paymentMethods = purchase.payment_method;

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

                    {/* Purchase Information */}
                    <div className="flex bg-gray-100 p-4 rounded">
                        <div className='w-full md:w-1/2'>
                            <h3 className="text-xl font-semibold mb-2">Purchase Information</h3>
                            <p className='mb-1'><strong>Purchase
                                Date:</strong> {new Date(purchase.purchase_date).toLocaleDateString()}</p>
                            <p className='mb-1 capitalize'><strong>Payment Method:</strong> {paymentMethods.join(', ')}
                            </p>
                            <p className='mb-1'><strong>Total Price:</strong> {purchase.total_price.toLocaleString()} Rs
                            </p>
                            {paymentMethods.includes('credit') && (
                                <>
                                    <p className='mb-1'><strong>Amount
                                        Paid:</strong> {purchase.amount_paid.toLocaleString()} Rs
                                    </p>
                                    <p className='mb-1'><strong>Remaining
                                        Balance:</strong> {purchase.remaining_balance.toLocaleString()} Rs</p>
                                    <p className='mb-1'><strong>Due
                                        Date:</strong> {new Date(purchase.due_date).toLocaleDateString()}</p>
                                </>
                            )}

                            {purchase.supplier && (
                                <div className='mt-8'>
                                    <h3 className="text-xl font-semibold mb-2">Supplier Details</h3>
                                    <p className='mb-1'><strong>Name:</strong> {purchase.supplier.name}</p>
                                    {purchase.supplier.phone && (
                                        <p className='mb-1'><strong>Phone:</strong> {purchase.supplier.phone}</p>
                                    )}
                                    {purchase.supplier.email && (
                                        <p className='mb-1'><strong>Email:</strong> {purchase.supplier.email}</p>
                                    )}
                                    {purchase.supplier.email && (
                                        <p className='mb-1'><strong>Address:</strong> {purchase.supplier.address}</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className='w-full md:w-1/2'>
                            <div className='mb-6'>
                                {paymentMethods.includes('cheque') && (purchase.cheque_details) && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Cheque Details</h3>
                                        <p className='mb-1'><strong>Cheque
                                            Number:</strong> {purchase.cheque_details.cheque_number}
                                        </p>
                                        <p className='mb-1'><strong>Cheque
                                            Bank:</strong> {purchase.cheque_details.cheque_bank}
                                        </p>
                                        <p className='mb-1'><strong>Cheque
                                            Date:</strong> {purchase.cheque_details.cheque_date}
                                        </p>
                                        <p className='mb-1'><strong>Cheque
                                            Amount:</strong> {purchase.cheque_details.cheque_amount} Rs
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className='mb-6'>
                                {paymentMethods.includes('account') && (purchase.account) && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Account Details</h3>
                                        <p className='mb-1'>
                                            <strong>Account:</strong> {purchase.account.title + ' - ' + purchase.account.bank_name}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className='mb-6'>
                                {paymentMethods.includes('credit') && (purchase.amount_paid) && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Credit Details</h3>
                                        <p className='mb-1'><strong>Amount
                                            Paid:</strong> {purchase.amount_paid.toLocaleString()} Rs
                                        </p>
                                        <p className='mb-1'><strong>Remaining
                                            Balance:</strong> {purchase.remaining_balance.toLocaleString()} Rs</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <hr className="my-6"/>

                    {/* Product List */}
                    <div className="overflow-x-auto">
                        {/* Item-Type Table */}
                        <h3 className="text-xl font-semibold mb-4">Item Base Products:</h3>
                        {purchase.product_items.some(item => {
                            const product = products.find(p => p.id === item.product_id);
                            return product && product.product_type === "item";
                        }) && (
                            <table className="min-w-full bg-white border border-gray-200 mb-8">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 text-center border">Product Name</th>
                                    <th className="py-2 px-4 text-center border">Size</th>
                                    <th className="py-2 px-4 text-center border">Quantity</th>
                                    <th className="py-2 px-4 text-center border">Rate (Rs)</th>
                                    <th className="py-2 px-4 text-center border">Total Price (Rs)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {purchase.product_items.map((item) => {
                                    const product = products.find(p => p.id === item.product_id);
                                    if (product && product.product_type === "item") {
                                        // Find the size name based on product_size_id
                                        const size = product.sizes.find(s => s.id === item.product_size_id);
                                        const totalPrice = item.purchase_price * item.quantity;

                                        return (
                                            <tr key={item.id} className='text-center'>
                                                <td className="py-2 px-4 border">{product.name}</td>
                                                <td className="py-2 px-4 border">{size ? size.size : '-'}</td>
                                                <td className="py-2 px-4 border">{item.quantity}</td>
                                                <td className="py-2 px-4 border">{item.purchase_price.toLocaleString()} Rs</td>
                                                <td className="py-2 px-4 border">{totalPrice.toLocaleString()} Rs</td>
                                            </tr>
                                        );
                                    }
                                    return null;
                                })}
                                </tbody>
                            </table>
                        )}

                        <h3 className="text-xl font-semibold mb-4">Weight Base Products:</h3>
                        {/* Weight-Type Table */}
                        {purchase.product_items.some(item => {
                            const product = products.find(p => p.id === item.product_id);
                            return product && product.product_type === "weight";
                        }) && (
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 text-center border">Product Name</th>
                                    <th className="py-2 px-4 text-center border">Sizes</th>
                                    <th className="py-2 px-4 text-center border">Weight</th>
                                    <th className="py-2 px-4 text-center border">Rate (Rs)</th>
                                    <th className="py-2 px-4 text-center border">Total Price (Rs)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {purchase.product_items.map((item) => {
                                    const product = products.find(p => p.id === item.product_id);
                                    if (product && product.product_type === "weight") {

                                        const sizeInfo = product.sizes.map(size => {
                                            const quantity = purchase.product_items.filter(i => i.product_size_id === size.id).reduce((total, i) => total + i.quantity, 0);
                                            return (
                                                <div key={size.id}
                                                     className='flex flex-col justify-center items-center gap-1'>
                                                    <div className='border-b border-black px-2'>{size.size}</div>
                                                    <div>{quantity}</div>
                                                </div>
                                            );
                                        });


                                        const totalPrice = item.purchase_price * item.quantity;

                                        return (
                                            <tr key={item.id} className='text-center'>
                                                <td className="py-2 px-4 border">{product.name}</td>
                                                <td className="py-2 px-4 border">
                                                    <div className='flex justify-center items-center gap-3'>
                                                        {sizeInfo}
                                                    </div>
                                                </td>
                                                {/*<td className="py-2 px-4 border">*/}
                                                {/*    <div className='flex justify-center items-center gap-3'>*/}
                                                {/*        {product.sizes.map((size, idx) => (*/}
                                                {/*            <div key={idx}>*/}
                                                {/*                <div*/}
                                                {/*                    className='border-b border-black px-2'>{size.size}</div>*/}
                                                {/*                <div>{size.quantity}</div>*/}
                                                {/*            </div>*/}
                                                {/*        ))}*/}
                                                {/*    </div>*/}
                                                {/*</td>*/}
                                                <td className="py-2 px-4 border">{item.weight} KG</td>
                                                <td className="py-2 px-4 border">{item.purchase_price.toLocaleString()} Rs</td>
                                                <td className="py-2 px-4 border">{totalPrice.toLocaleString()} Rs</td>
                                            </tr>
                                        );
                                    }
                                    return null;
                                })}
                                {/*{products.map((product) => {*/}
                                {/*    // Filter the product items that belong to the current product*/}
                                {/*    const productItemsForCurrentProduct = purchase.product_items.filter(item => item.product_id === product.id);*/}

                                {/*    // Check if the product is of type "weight"*/}
                                {/*    if (product && product.product_type === "weight") {*/}
                                {/*        // For each size in the product, calculate the total quantity from all product_items*/}
                                {/*        const sizeInfo = product.sizes.map(size => {*/}
                                {/*            const quantity = productItemsForCurrentProduct*/}
                                {/*                .filter(i => i.product_size_id === size.id)*/}
                                {/*                .reduce((total, i) => total + i.quantity, 0);*/}
                                {/*            return { size: size.size, quantity };*/}
                                {/*        });*/}

                                {/*        // Calculate the total price for the product (sum of all quantities and prices)*/}
                                {/*        const totalPrice = productItemsForCurrentProduct.reduce(*/}
                                {/*            (total, item) => total + item.purchase_price * item.quantity,*/}
                                {/*            0*/}
                                {/*        );*/}

                                {/*        return (*/}
                                {/*            <tr key={product.id} className='text-center'>*/}
                                {/*                <td className="py-2 px-4 border">{product.name}</td>*/}
                                {/*                <td className="py-2 px-4 border">*/}
                                {/*                    /!* Display sizes and their quantities in one column *!/*/}
                                {/*                    <div className='flex justify-center items-center gap-3'>*/}
                                {/*                        {sizeInfo.map((size, idx) => (*/}
                                {/*                            <div key={idx} className='flex flex-col justify-center items-center gap-1'>*/}
                                {/*                                <div className='border-b border-black px-2'>{size.size}</div>*/}
                                {/*                                <div>{size.quantity}</div>*/}
                                {/*                            </div>*/}
                                {/*                        ))}*/}
                                {/*                    </div>*/}
                                {/*                </td>*/}
                                {/*                <td className="py-2 px-4 border">*/}
                                {/*                    /!* Display total weight (sum of weights for each product item) *!/*/}
                                {/*                    {productItemsForCurrentProduct.reduce((total, item) => total + item.weight, 0)} KG*/}
                                {/*                </td>*/}
                                {/*                <td className="py-2 px-4 border">*/}
                                {/*                    /!* Display price per unit (first product item price) *!/*/}
                                {/*                    {productItemsForCurrentProduct[0]?.purchase_price.toLocaleString()} Rs*/}
                                {/*                </td>*/}
                                {/*                <td className="py-2 px-4 border">*/}
                                {/*                    /!* Display total price for all product items *!/*/}
                                {/*                    {totalPrice.toLocaleString()} Rs*/}
                                {/*                </td>*/}
                                {/*            </tr>*/}
                                {/*        );*/}
                                {/*    }*/}
                                {/*    return null;*/}
                                {/*})}*/}

                                </tbody>
                            </table>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
