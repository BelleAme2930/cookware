import React from 'react';
import {Head} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import ShadowBox from "@/Components/ShadowBox.jsx";

const Show = ({product}) => {

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Product Details</h2>
                </div>
            }
        >
            <Head title={`Product: ${product.name}`}/>
            <div className="max-w-[90%] w-full mx-auto p-4">
                <ShadowBox>
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">{product.name}</h3>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-700 mb-2">Product & Stock Details</h4>
                            <div className='bg-white shadow-sm p-4 rounded-lg border border-gray-200 flex'>
                                <div className='w-full md:w-1/2'>
                                    <div className="text-gray-600 mb-2">
                                        <strong>Category:</strong> {product.category ? product.category.name : 'N/A'}
                                    </div>
                                    <div className="text-gray-600 mb-2">
                                        <strong>Supplier:</strong> {product.supplier ? product.supplier.name : 'N/A'}
                                    </div>
                                    <div className="text-gray-600 mb-2">
                                        <strong>Product
                                            Type:</strong> {product.product_type === 'weight' ? 'Per KG' : 'Per Item'}
                                    </div>
                                    <div className="text-gray-600">
                                        <strong>Available
                                            Sizes:</strong> {product.sizes.length > 0 ? product.sizes.map(size => size.size).join(', ') : 'No sizes available'}
                                    </div>
                                </div>
                                <div className='w-full md:w-1/2'>
                                    <div className="text-gray-600 mb-2">
                                        <strong>Total Available Weight:</strong> {product.weight} KG
                                    </div>
                                    {product.product_type === 'weight' && (
                                        <div className="text-gray-600 mb-2">
                                            <strong>Total Available Quantity:</strong> {product.quantity} Pcs
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {product.sizes.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-lg font-semibold text-gray-700 mb-2">Sizes & Price Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {product.sizes.map((sizeObj, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col bg-white shadow-sm p-4 rounded-lg border border-gray-200"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className='text-md text-gray-700'>
                                                <div className='mb-1'><strong>Size: </strong>{sizeObj.size}</div>
                                                <div className='mb-1'><strong>Price: </strong>{sizeObj.sale_price} Rs
                                                </div>
                                                {product.product_type === 'weight' &&
                                                    <div className='mb-1'><strong>Weight per KG: </strong>{sizeObj.weight} KG</div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </ShadowBox>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
