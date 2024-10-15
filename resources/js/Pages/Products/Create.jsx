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
        if (newSize.trim() === '' || newWeight.trim() === '' || newSalePrice.trim() === '') {
            toast.error('Size, weight, and sale price cannot be empty');
            return;
        }

        if (data.sizes.some(size => size.size === newSize)) {
            toast.error('Size already exists');
            return;
        }

        setData('sizes', [
            ...data.sizes,
            { size: newSize, weight: parseInt(newWeight), sale_price: parseFloat(newSalePrice) },
        ]);
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

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Add New Product</h2>
                </div>
            }
        >
            <Head title="Add Product"/>
            <div className="max-w-[900px] mx-auto p-4">
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

                            {/* Size, Weight, and Sale Price Input */}
                            <div className="mb-4 w-full">
                                <Label htmlFor='newSize' title='Size, Weight & Sale Price'/>
                                <div className="flex gap-2 items-center">
                                    <TextInput
                                        id="newSize"
                                        value={newSize}
                                        onChange={(e) => setNewSize(e.target.value)}
                                        placeholder="Enter size (e.g., XS, XXL)"
                                    />
                                    <TextInput
                                        type="number"
                                        id="newWeight"
                                        value={newWeight}
                                        onChange={(e) => setNewWeight(e.target.value)}
                                        placeholder="Weight in KG"
                                    />
                                    <TextInput
                                        type="number"
                                        id="newSalePrice"
                                        value={newSalePrice}
                                        onChange={(e) => setNewSalePrice(e.target.value)}
                                        placeholder="Sale Price"
                                    />
                                    <IconButton type="button" onClick={addSize} icon={faAdd}/>
                                </div>
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
                                                    <div className="text-sm font-semibold text-gray-700">
                                                        Weight: {sizeObj.weight} KG
                                                    </div>
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

                            <div className='px-2'>
                                <Button type="submit" disabled={processing}>
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
