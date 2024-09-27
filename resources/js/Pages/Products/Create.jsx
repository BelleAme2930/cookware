import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";

const Create = () => {
    const { data, setData, post, errors, processing, reset } = useForm({
        name: '',
        base_weight: '',
        price_per_kg: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('products.store'), {
            onSuccess: () => {
                toast.success('Product added successfully');
                reset();
            },
            onError: () => {
                toast.error('Failed to add product');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Add New Product</h2>
                </div>
            }
        >
            <Head title="Add Product" />
            <div className="max-w-lg mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label title='Product Name' htmlFor='name' />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className={`w-full ${errors.name ? 'border-red-600' : ''}`}
                        />
                        {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                    </div>

                    <div className="mb-4">
                        <Label title='Base Weight (grams)' htmlFor='base_weight' />
                        <TextInput
                            id="base_weight"
                            type="number"
                            value={data.base_weight}
                            onChange={(e) => setData('base_weight', e.target.value)}
                            required
                            className={`w-full ${errors.base_weight ? 'border-red-600' : ''}`}
                        />
                        {errors.base_weight && <div className="text-red-600 text-sm">{errors.base_weight}</div>}
                    </div>

                    <div className="mb-4">
                        <Label title='Price Per Kilogram' htmlFor='price_per_kg' />
                        <TextInput
                            id="price_per_kg"
                            type="number"
                            value={data.price_per_kg}
                            onChange={(e) => setData('price_per_kg', e.target.value)}
                            required
                            className={`w-full ${errors.price_per_kg ? 'border-red-600' : ''}`}
                        />
                        {errors.price_per_kg && <div className="text-red-600 text-sm">{errors.price_per_kg}</div>}
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                    >
                        Add Product
                    </Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
