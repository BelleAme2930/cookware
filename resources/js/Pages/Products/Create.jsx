import React from 'react';
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";
import InputSelect from "@/Components/InputSelect.jsx";
import ImageUploader from "@/Components/ImageUploader.jsx";
import Label from "@/Components/Label.jsx";

const Create = ({ categories, suppliers }) => {
    const { data, setData, post, errors, processing, reset } = useForm({
        name: '',
        category_id: '',
        supplier_id: '',
        weight_per_unit: '',
        image: null,
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
            <div className="max-w-[90%] mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-wrap'>
                        <div className="mb-4 w-full lg:w-1/2 px-2">
                            <Label htmlFor='name' title='Product Name' />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                className={`w-full ${errors.name ? 'border-red-600' : ''}`}
                            />
                            {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                        </div>

                        <InputSelect
                            id="category_id"
                            label="Category"
                            options={categories}
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            error={errors.category_id}
                            required
                            errorMsg={errors.category_id}
                            link={categories.length === 0 ? route('categories.create') : null}
                            linkText="Add category?"
                        />

                        <InputSelect
                            id="supplier_id"
                            label="Supplier"
                            options={suppliers}
                            value={data.supplier_id}
                            onChange={(e) => setData('supplier_id', e.target.value)}
                            error={errors.supplier_id}
                            required
                            errorMsg={errors.supplier_id}
                            link={suppliers.length === 0 ? route('suppliers.create') : null}
                            linkText="Add supplier?"
                        />

                        <div className="mb-4 w-full lg:w-1/2 px-2">
                            <Label htmlFor='weight_per_unit' title='Weight' />
                            <TextInput
                                type="number"
                                id="weight_per_unit"
                                value={data.weight_per_unit}
                                onChange={(e) => setData('weight_per_unit', e.target.value)}
                                required
                                className={`w-full ${errors.weight_per_unit ? 'border-red-600' : ''}`}
                            />
                            {errors.weight_per_unit && <div className="text-red-600 text-sm">{errors.weight_per_unit}</div>}
                        </div>

                        <ImageUploader
                            id="image"
                            onChange={(e) => setData('image', e.target.files[0])}
                            error={errors.image}
                        />
                    </div>
                    <div className='px-2'>
                        <Button type="submit" disabled={processing}>
                            Add Product
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
