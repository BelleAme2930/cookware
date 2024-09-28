import React, { useState } from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";

const Create = ({ customers, products }) => {
    const { data, setData, post, processing } = useForm({
        customer_id: '',
        products: [{ product_id: '', weight: 0, total_price: 0 }],
    });

    const addProduct = () => {
        setData('products', [...data.products, { product_id: '', weight: 0, total_price: 0 }]);
    };

    const handleProductChange = (index, e) => {
        const updatedProducts = [...data.products];
        updatedProducts[index][e.target.name] = e.target.value;
        updatedProducts[index]['total_price'] = updatedProducts[index]['weight'] * products.find(product => product.id === parseInt(updatedProducts[index]['product_id'])).price; // Assume price is part of the product
        setData('products', updatedProducts);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('transactions.store'), {
            onSuccess: () => {
                toast.success('Transaction created successfully');
            },
            onError: () => {
                toast.error('Failed to create transaction');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-lg leading-tight text-gray-800">Create Transaction</h2>}
        >
            <Head title="Create Transaction" />
            <div className="max-w-lg mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label title='Customer' htmlFor='customer_id' />
                        <select
                            name="customer_id"
                            value={data.customer_id}
                            onChange={e => setData('customer_id', e.target.value)}
                            required
                            className="w-full border rounded p-2"
                        >
                            <option value="">Select a customer</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>{customer.name}</option>
                            ))}
                        </select>
                    </div>

                    {data.products.map((product, index) => (
                        <div key={index} className="mb-4">
                            <Label title='Product' htmlFor={`product_${index}`} />
                            <select
                                name="product_id"
                                value={product.product_id}
                                onChange={e => handleProductChange(index, e)}
                                required
                                className="w-full border rounded p-2"
                            >
                                <option value="">Select a product</option>
                                {products.map(prod => (
                                    <option key={prod.id} value={prod.id}>{prod.name}</option>
                                ))}
                            </select>

                            <Label title='Weight (kg)' htmlFor={`weight_${index}`} />
                            <TextInput
                                name="weight"
                                type="number"
                                value={product.weight}
                                onChange={e => handleProductChange(index, e)}
                                required
                                className="w-full border rounded p-2"
                            />
                        </div>
                    ))}

                    <Button type="button" onClick={addProduct}>Add Another Product</Button>
                    <Button type="submit" disabled={processing}>Create Transaction</Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
