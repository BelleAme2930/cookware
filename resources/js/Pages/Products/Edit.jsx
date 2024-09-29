import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";
import InputSelect from "@/Components/InputSelect.jsx";
import ImageUploader from "@/Components/ImageUploader.jsx";
import Label from "@/Components/Label.jsx";

const Edit = ({ product, categories, suppliers }) => {
    const { data, setData, put, errors, processing } = useForm({
        name: product.name,
        category_id: product.category_id,
        supplier_id: product.supplier_id,
        weight: product.weight || 0,
        quantity: product.quantity || 0,
        price: product.price || 0,
        image: null,
        product_type: product.product_type || 'weight',
    });

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name,
    }));

    const supplierOptions = suppliers.map(sup => ({
        value: sup.id,
        label: sup.name,
    }));

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
            <div className="max-w-[800px] mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-wrap'>
                        <div className="mb-4 w-full">
                            <Label htmlFor='name' required title='Product Name'/>
                            <TextInput
                                required
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full ${errors.name ? 'border-red-600' : ''}`}
                            />
                            {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                        </div>

                        <InputSelect
                            id="category_id"
                            label="Category"
                            options={categoryOptions}
                            value={data.category_id}
                            onChange={(value) => setData('category_id', value.value)}
                            link={categories.length === 0 ? route('categories.create') : null}
                            linkText="Add category?"
                            required
                        />

                        <InputSelect
                            id="supplier_id"
                            label="Supplier"
                            options={supplierOptions}
                            value={data.supplier_id}
                            onChange={(value) => setData('supplier_id', value.value)}
                            link={suppliers.length === 0 ? route('suppliers.create') : null}
                            linkText="Add supplier?"
                            required
                        />

                        <InputSelect
                            id="product_type"
                            label="Product Type"
                            options={[
                                { label: 'Per KG', value: 'weight' },
                                { label: 'Per Item', value: 'item' },
                            ]}
                            value={data.product_type}
                            onChange={(value) => setData('product_type', value.value)}
                            required
                        />

                        {data.product_type === 'weight' ? (
                            <>
                                <div className="mb-4 w-full">
                                    <Label htmlFor='weight' required title='Weight (KG)'/>
                                    <TextInput
                                        type="number"
                                        id="weight"
                                        value={data.weight}
                                        onChange={(e) => setData('weight', e.target.value)}
                                        required
                                        className={`w-full ${errors.weight ? 'border-red-600' : ''}`}
                                    />
                                    {errors.weight && <div className="text-red-600 text-sm">{errors.weight}</div>}
                                </div>

                                <div className="mb-4 w-full">
                                    <Label htmlFor='price' required title='Price Per KG' suffix='PKR'/>
                                    <TextInput
                                        type="number"
                                        id="price"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                        className={`w-full ${errors.price ? 'border-red-600' : ''}`}
                                    />
                                    {errors.price && <div className="text-red-600 text-sm">{errors.price}</div>}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-4 w-full">
                                    <Label htmlFor='quantity' required title='Item Stock'/>
                                    <TextInput
                                        type="number"
                                        id="quantity"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', e.target.value)}
                                        required
                                        className={`w-full ${errors.quantity ? 'border-red-600' : ''}`}
                                    />
                                    {errors.quantity &&
                                        <div className="text-red-600 text-sm">{errors.quantity}</div>}
                                </div>

                                <div className="mb-4 w-full">
                                    <Label htmlFor='price' required title='Price Per Item' suffix='PKR'/>
                                    <TextInput
                                        type="number"
                                        id="price"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                        className={`w-full ${errors.price ? 'border-red-600' : ''}`}
                                    />
                                    {errors.price && <div className="text-red-600 text-sm">{errors.price}</div>}
                                </div>
                            </>
                        )}

                        <ImageUploader
                            title='Select Product Image'
                            id="image"
                            onChange={(e) => setData('image', e.target.files[0])}
                            error={errors.image}
                        />
                    </div>
                    <div className='px-2'>
                        <Button type="submit" disabled={processing}>
                            Update Product
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
