import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";
import ImageUploader from "@/Components/ImageUploader.jsx";
import InputSelect from "@/Components/InputSelect.jsx";

const Edit = ({ product, categories, suppliers }) => {
    const { data, setData, put, errors, processing, isDirty } = useForm({
        category_id: product.category_id ?? 1,
        supplier_id: product.supplier_id ?? 1,
        name: product.name ?? '',
        weight: product.weight ?? 0,
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('products.update', product.id), {
            onSuccess: () => {
                toast.success('Product updated successfully');
            },
            onError: () => {
                toast.error('Failed to update product');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Edit Product</h2>
                </div>
            }
        >
            <Head title="Edit Product" />
            <div className="max-w-[90%] mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-wrap'>
                        <div className="mb-4 w-full lg:w-1/2 px-2">
                            <Label title='Product Name' htmlFor='name'/>
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
                            <Label title='Weight' htmlFor='weight'/>
                            <TextInput
                                type="number"
                                id="weight"
                                value={data.weight}
                                onChange={(e) => setData('weight', parseFloat(e.target.value))}
                                required
                                className={`w-full ${errors.weight ? 'border-red-600' : ''}`}
                            />
                            {errors.weight && <div className="text-red-600 text-sm">{errors.weight}</div>}
                        </div>

                        <ImageUploader
                            title='Change Product Image'
                            id="image"
                            onChange={(e) => setData('image', e.target.files[0])}
                            error={errors.image}
                            value={product.image}
                        />
                    </div>
                    <div className='px-2'>
                        <Button type="submit" disabled={processing | !isDirty}>
                            Update Product
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
