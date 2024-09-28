import React from 'react';
import { Head, useForm } from "@inertiajs/react";
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
        weight: 0,
        image: null,
    });

    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.name,
    }));

    const supplierOptions = suppliers.map(sup => ({
        value: sup.id,
        label: sup.name,
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('products.store'), {
            onSuccess: () => {
                toast.success('Product added successfully');
                reset();
            },
            onError: () => {
                toast.error('Failed to add product');
                console.error(errors);
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

                        <div className="mb-4 w-full">
                            <Label htmlFor='weight' required title='Weight'/>
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

                        <ImageUploader
                            title='Select Product Image'
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
