import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Show = ({ product }) => {
    console.log(product);
    const editRoute = (id) => route('products.edit', id);
    const deleteRoute = (id) => route('products.destroy', id);

    // Parse sizes JSON string into a JavaScript object
    const sizes = product.sizes ? JSON.parse(product.sizes) : {};

    const confirmDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            router.delete(deleteRoute(id), {
                onSuccess: () => {
                    toast.success('Product deleted successfully.');
                },
                onError: () => {
                    toast.error('Failed to delete product.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg font-semibold text-gray-800">{`Product: ${product.name}`}</h2>
                    <div className="flex space-x-2">
                        <PrimaryIconLink href={editRoute(product.id)} icon={faEdit}>Edit Product</PrimaryIconLink>
                        <IconButton onClick={() => confirmDelete(product.id)} icon={faTrash} />
                    </div>
                </div>
            }
        >
            <Head title={`Product - ${product.name}`} />
            <div className='mx-auto max-w-[900px] py-6 space-y-6'>
                {/* Product Details Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 text-primary-500">Product Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600"><strong>Name:</strong> {product.name}</p>
                            <p className="text-gray-600"><strong>Product Type:</strong> {product.product_type === 'weight' ? 'Per KG' : 'Per Item'}</p>
                            <p className="text-gray-600"><strong>Weight (kg):</strong> {product.weight}</p>
                            <p className="text-gray-600"><strong>Quantity:</strong> {product.quantity}</p>
                        </div>
                        <div>
                            <p className="text-gray-600"><strong>Sale Price:</strong> {product.sale_price} Rs</p>
                            <p className="text-gray-600"><strong>Total Stock Price:</strong> {product.total_stock_price} Rs</p>
                            <p className="text-gray-600"><strong>Created At:</strong> {new Date(product.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Sizes Information Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 text-primary-500">Sizes</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {Object.keys(sizes).length > 0 ? (
                            <ul className="list-disc pl-5 text-gray-600">
                                {Object.entries(sizes).map(([size, quantity]) => (
                                    <li key={size}>
                                        <strong>Size {size}:</strong> {quantity} available
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No sizes available</p>
                        )}
                    </div>
                </div>

                {/* Category Information Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 text-primary-500">Category Information</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <p className="text-gray-600"><strong>Name:</strong> {product.category.name}</p>
                        <p className="text-gray-600"><strong>Description:</strong> {product.category.description || 'No description available'}</p>
                    </div>
                </div>

                {/* Supplier Information Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 text-primary-500">Supplier Information</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <p className="text-gray-600"><strong>Name:</strong> {product.supplier.name}</p>
                        <p className="text-gray-600"><strong>Email:</strong> {product.supplier.email}</p>
                        <p className="text-gray-600"><strong>Phone:</strong> {product.supplier.phone}</p>
                        <p className="text-gray-600"><strong>Address:</strong> {product.supplier.address}</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
