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
                            <p className='mb-1'><strong>Total Price:</strong> {purchase.total_price.toLocaleString()} Rs
                            </p>
                            <p className='mb-1'><strong>Purchase
                                Date:</strong> {new Date(purchase.purchase_date).toLocaleDateString()}</p>
                            {purchase.due_date && (
                                <p className='mb-1'><strong>Due
                                    Date:</strong> {new Date(purchase.due_date).toLocaleDateString()}</p>
                            )}
                            <p className='mb-1'><strong>Payment Method:</strong> {purchase.payment_method}</p>
                            <p className='mb-1'><strong>Remaining Balance:</strong> {purchase.remaining_balance.toLocaleString()} Rs</p>
                        </div>

                        {purchase.supplier && (
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Supplier Details</h3>
                                <p className='mb-1'><strong>Name:</strong> {purchase.supplier.name}</p>
                                {purchase.supplier.phone && (
                                    <p className='mb-1'><strong>Email:</strong> {purchase.supplier.phone}</p>
                                )}

                                {purchase.supplier.email && (
                                    <p className='mb-1'><strong>Email:</strong> {purchase.supplier.email}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <hr className="my-6"/>

                    {/* Product List */}
                    <h3 className="text-xl font-semibold mb-4">Products</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                            {purchase.product_purchases[0].product_type === 'weight' ? (
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 border">Product Name</th>
                                    <th className="px-4 py-2 border">Size</th>
                                    <th className="px-4 py-2 border">Quantity</th>
                                    <th className="px-4 py-2 border">Rate</th>
                                    <th className="px-4 py-2 border">Total Price</th>
                                </tr>
                            ) : (
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 border">Product Name</th>
                                    <th className="px-4 py-2 border">Sizes</th>
                                    <th className="px-4 py-2 border">Weight</th>
                                    <th className="px-4 py-2 border">Rate</th>
                                    <th className="px-4 py-2 border">Total Price</th>
                                </tr>
                            )}

                            </thead>
                            <tbody>
                            {purchase.product_purchases[0].product_type === 'weight' ? (
                                <>
                                    {purchase.product_purchases.map((prod, index) => {
                                        return prod.sizes.map((size, idx) => {
                                            const unitPrice = size.purchase_price * size.quantity;
                                          return (
                                              <tr key={`${index}-${idx}`} className="text-center">
                                                  <td className="px-4 py-2 border">{prod.name}</td>
                                                  <td className="px-4 py-2 border">{size.size}</td>
                                                  <td className="px-4 py-2 border">{size.quantity}</td>
                                                  <td className="px-4 py-2 border">{size.purchase_price.toLocaleString()} Rs</td>
                                                  <td className="px-4 py-2 border">{unitPrice.toLocaleString()}</td>
                                              </tr>
                                          );
                                      });
                                  })}
                              </>
                            ) : (
                                <>
                                    {purchase.product_purchases.map((prod, index) => (
                                        <tr key={index} className="text-center">
                                            <td className="px-4 py-2 border">{prod.name}</td>
                                            <td className="px-4 py-2 border">
                                                <div className='flex justify-center items-center gap-3'>
                                                    {prod.sizes.map((size, idx) => (
                                                        <div key={idx}>
                                                            <div className='border-b border-black px-2'>{size.size}</div>
                                                            <div>{size.quantity}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border">{purchase.weight} KG</td>
                                            <td className="px-4 py-2 border">{purchase.product_purchases[0].sizes[0].purchase_price} Rs</td>
                                            <td className="px-4 py-2 border">
                                                {(purchase.weight * purchase.product_purchases[0].sizes[0].purchase_price).toLocaleString()} Rs
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
