import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";

const Edit = ({ product, categories, suppliers }) => {
    const { data, setData, put, errors, processing } = useForm({
        category_id: product.category_id,
        supplier_id: product.supplier_id,
        name: product.name,
        weight_per_unit: product.weight_per_unit,
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
                        <Label title='Category' htmlFor='category_id' />
                        <select
                            id="category_id"
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            required
                            className={`w-full ${errors.category_id ? 'border-red-600' : ''}`}
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <div className="text-red-600 text-sm">{errors.category_id}</div>}
                    </div>

                    <div className="mb-4">
                        <Label title='Supplier' htmlFor='supplier_id' />
                        <select
                            id="supplier_id"
                            value={data.supplier_id}
                            onChange={(e) => setData('supplier_id', e.target.value)}
                            required
                            className={`w-full ${errors.supplier_id ? 'border-red-600' : ''}`}
                        >
                            <option value="">Select a supplier</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                            ))}
                        </select>
                        {errors.supplier_id && <div className="text-red-600 text-sm">{errors.supplier_id}</div>}
                    </div>

                    <div className="mb-4">
                        <Label title='Weight' htmlFor='weight_per_unit' />
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

                    <div className="mb-4">
                        <Label title='Product Image' htmlFor='image' />
                        <input
                            type="file"
                            id="image"
                            onChange={(e) => setData('image', e.target.files[0])}
                            className={`w-full ${errors.image ? 'border-red-600' : ''}`}
                        />
                        {errors.image && <div className="text-red-600 text-sm">{errors.image}</div>}
                    </div>

                    <Button type="submit" disabled={processing}>
                        Update Product
                    </Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
