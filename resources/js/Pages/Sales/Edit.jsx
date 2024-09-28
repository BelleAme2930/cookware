import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";
import InputSelect from "@/Components/InputSelect.jsx";

const Edit = ({ sale, customers, products }) => {
    const { data, setData, put, errors, processing } = useForm({
        customer_id: sale.customer_id,
        product_id: sale.product_id,
        weight: sale.weight,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('sales.update', sale.id), {
            onSuccess: () => {
                toast.success('Sale updated successfully');
            },
            onError: () => {
                toast.error('Failed to update sale');
            },
        });
    };

    const customerOptions = customers.map(customer => ({
        value: customer.id,
        label: customer.name,
    }));

    const productOptions = products.map(product => ({
        value: product.id,
        label: product.name,
    }));

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Edit Sale</h2>
                </div>
            }
        >
            <Head title="Edit Sale" />
            <div className="max-w-lg mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <InputSelect
                        id="customer_id"
                        label="Customer"
                        options={customerOptions}
                        value={data.customer_id}
                        onChange={(selectedOption) => setData('customer_id', selectedOption.value)}
                        error={errors.customer_id}
                        errorMsg={errors.customer_id ? 'Customer is required' : ''}
                        required
                    />
                    <InputSelect
                        id="product_id"
                        label="Product"
                        options={productOptions}
                        value={data.product_id}
                        onChange={(selectedOption) => setData('product_id', selectedOption.value)}
                        error={errors.product_id}
                        errorMsg={errors.product_id ? 'Product is required' : ''}
                        required
                    />
                    <div className="mb-4">
                        <Label title='Weight (kg)' required={true} htmlFor='weight' />
                        <TextInput
                            type="number"
                            id="weight"
                            value={data.weight}
                            onChange={(e) => setData('weight', e.target.value)}
                            className={`w-full ${errors.weight ? 'border-red-600' : ''}`}
                        />
                        {errors.weight && <div className="text-red-600 text-sm">{errors.weight}</div>}
                    </div>
                    <Button type="submit" disabled={processing}>
                        Update Sale
                    </Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
