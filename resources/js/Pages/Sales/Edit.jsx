import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";

const Edit = ({ transaction, customers, products }) => {
    const { data, setData, put, errors, processing } = useForm({
        customer_id: transaction.customer_id,
        product_id: transaction.product_id,
        quantity: transaction.quantity / 1000, // Convert grams to kg for display
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('sales.update', transaction.id), {
            onSuccess: () => {
                toast.success('Transaction updated successfully');
            },
            onError: () => {
                toast.error('Failed to update transaction');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Edit Sale Transaction</h2>
                </div>
            }
        >
            <Head title="Edit Transaction" />
            <div className="max-w-lg mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label title='Customer' required={true} htmlFor='customer_id' />
                        <select
                            id="customer_id"
                            value={data.customer_id}
                            onChange={(e) => setData('customer_id', e.target.value)}
                            className={`w-full ${errors.customer_id ? 'border-red-600' : ''}`}
                        >
                            <option value="">Select Customer</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>{customer.name}</option>
                            ))}
                        </select>
                        {errors.customer_id && <div className="text-red-600 text-sm">{errors.customer_id}</div>}
                    </div>
                    <div className="mb-4">
                        <Label title='Product' required={true} htmlFor='product_id' />
                        <select
                            id="product_id"
                            value={data.product_id}
                            onChange={(e) => setData('product_id', e.target.value)}
                            className={`w-full ${errors.product_id ? 'border-red-600' : ''}`}
                        >
                            <option value="">Select Product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </select>
                        {errors.product_id && <div className="text-red-600 text-sm">{errors.product_id}</div>}
                    </div>
                    <div className="mb-4">
                        <Label title='Quantity (kg)' required={true} htmlFor='quantity' />
                        <TextInput
                            id="quantity"
                            type="number"
                            value={data.quantity}
                            onChange={(e) => setData('quantity', e.target.value)}
                            className={`w-full ${errors.quantity ? 'border-red-600' : ''}`}
                        />
                        {errors.quantity && <div className="text-red-600 text-sm">{errors.quantity}</div>}
                    </div>
                    <Button type="submit" disabled={processing}>
                        Update Transaction
                    </Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;