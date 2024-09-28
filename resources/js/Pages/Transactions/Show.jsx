import React from 'react';
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

const Show = ({ transaction }) => {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-lg leading-tight text-gray-800">Transaction Details</h2>}
        >
            <Head title="Transaction Details" />
            <div className="max-w-6xl mx-auto p-4">
                <h3 className="text-xl font-semibold">Customer: {transaction.customer.name}</h3>
                <h4 className="text-lg font-medium">Total Price: {transaction.total_price}</h4>
                <h5 className="text-md font-medium">Products:</h5>
                <ul>
                    {transaction.products.map(product => (
                        <li key={product.id}>
                            {product.pivot.weight} grams of {product.name} - {product.pivot.total_price}
                        </li>
                    ))}
                </ul>
                <p>Created at: {transaction.created_at}</p>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
