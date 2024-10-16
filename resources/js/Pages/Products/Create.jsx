import React, { useState } from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";
import InputSelect from "@/Components/InputSelect.jsx";
import Label from "@/Components/Label.jsx";
import ShadowBox from "@/Components/ShadowBox.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";

const Create = ({ categories, suppliers }) => {
    const { data, setData, post, errors, processing, reset } = useForm({
        name: '',
        category_id: '',
        supplier_id: '',
        product_type: 'weight',
        sizes: [],
    });

    const [newSize, setNewSize] = useState('');
    const [newWeight, setNewWeight] = useState('');
    const [newSalePrice, setNewSalePrice] = useState('');

    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.name,
    }));

    const supplierOptions = suppliers.map(sup => ({
        value: sup.id,
        label: sup.name,
    }));

    const addSize = () => {
        if (newSize.trim() === '' || newSalePrice.trim() === '') {
            toast.error('Size and sale price cannot be empty');
            return;
        }

        if (data.product_type === 'weight' && newWeight.trim() === '') {
            toast.error('Weight cannot be empty for a weight-based product');
            return;
        }

        if (data.sizes.some(size => size.size === newSize)) {
            toast.error('Size already exists');
            return;
        }

        const newSizeData = {
            size: newSize,
            sale_price: newSalePrice,
        };

        if (data.product_type === 'weight') {
            newSizeData.weight = newWeight;
        }

        setData('sizes', [...data.sizes, newSizeData]);
        setNewSize('');
        setNewWeight('');
        setNewSalePrice('');
    };

    const removeSize = (sizeToRemove) => {
        const updatedSizes = data.sizes.filter(sizeObj => sizeObj.size !== sizeToRemove);
        setData('sizes', updatedSizes);
    };

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

    const isFormValid = () => {
        return (
            data.name &&
            data.category_id &&
            data.supplier_id &&
            data.product_type
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Add New Product</h2>
                </div>
            }
        >
            <Head title="Add Product"/>
            <div className="max-w-[90%] w-full mx-auto p-4">
                <ShadowBox>
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

                            <div className="mb-4 w-full">
                                <Label htmlFor='newSize' title={data.product_type === 'weight' ? 'Size, Weight & Sale Price' : 'Size & Sale Price'}/>
                                <div className="flex gap-2 items-center">
                                    <TextInput
                                        id="newSize"
                                        value={newSize}
                                        onChange={(e) => setNewSize(e.target.value)}
                                        placeholder="Enter size (e.g., XS, XXL)"
                                    />
                                    {data.product_type === 'weight' && (
                                        <TextInput
                                            type="number"
                                            id="newWeight"
                                            value={newWeight}
                                            onChange={(e) => setNewWeight(e.target.value)}
                                            placeholder="Weight in KG"
                                        />
                                    )}
                                    <TextInput
                                        type="number"
                                        id="newSalePrice"
                                        value={newSalePrice}
                                        onChange={(e) => setNewSalePrice(e.target.value)}
                                        placeholder={data.product_type === 'weight' ? 'Sale Price per KG' : 'Sale Price per piece'}
                                    />
                                    <IconButton type="button" onClick={addSize} icon={faAdd}/>
                                </div>
                                {errors.sizes && <div className="text-red-600 text-sm mt-2">{errors.sizes}</div>}
                            </div>

                            {/* Display added sizes */}
                            {data.sizes.length > 0 && (
                                <div className="mb-4 w-full">
                                    <Label title='Sizes & Prices'/>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {data.sizes.map((sizeObj, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col bg-white shadow-md p-4 rounded-lg border border-gray-300"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="text-sm font-semibold text-gray-700">
                                                        Size: {sizeObj.size}
                                                    </div>
                                                    {data.product_type === 'weight' && (
                                                        <div className="text-sm font-semibold text-gray-700">
                                                            Weight: {sizeObj.weight} KG
                                                        </div>
                                                    )}
                                                    <div className="text-sm font-semibold text-gray-700">
                                                        Price: {sizeObj.sale_price} Rs
                                                    </div>
                                                    <IconButton onClick={() => removeSize(sizeObj.size)} icon={faTrash}/>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className='flex justify-center w-full mt-3'>
                                <Button type="submit" disabled={processing || !isFormValid()}>
                                    Add Product
                                </Button>
                            </div>
                        </div>
                    </form>
                </ShadowBox>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
