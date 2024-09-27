import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

const Show = ({ product }) => {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-lg leading-tight text-gray-800">Product Details</h2>}
        >
            <Head title="Product Details" />
            <div className="max-w-lg mx-auto p-4">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p><strong>Category:</strong> {product.category.name}</p>
                <p><strong>Supplier:</strong> {product.supplier.name}</p>
                <p><strong>Weight:</strong> {(product.weight_per_unit / 1000).toFixed(2)} kg</p>
                {product.image && <img src={`/${product.image}`} alt={product.name} className="h-40 w-40" />}
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
