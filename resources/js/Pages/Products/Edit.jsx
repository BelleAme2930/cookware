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
import { faAdd } from "@fortawesome/free-solid-svg-icons";

const Edit = ({ product, categories, suppliers }) => {
    console.log(product)
    const { data, setData, put, errors, processing } = useForm({
        name: product.name || '',
        category_id: product.category_id || '',
        supplier_id: product.supplier_id || '',
        product_type: product.product_type || 'weight',
        weight_per_item: product.weight_per_item || 1,
        sizes: product.sizes || [],
    });

    const [newSize, setNewSize] = useState('');

    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.name,
    }));

    const supplierOptions = suppliers.map(sup => ({
        value: sup.id,
        label: sup.name,
    }));

    const addSize = () => {
        if (newSize.trim() === '') {
            toast.error('Size cannot be empty');
            return;
        }

        if (data.sizes.some(size => size.size === newSize)) {
            toast.error('Size already exists');
            return;
        }

        setData('sizes', [
            ...data.sizes,
            { size: newSize, sale_price: 0 },
        ]);
        setNewSize('');
    };

    const removeSize = (sizeToRemove) => {
        const updatedSizes = data.sizes.filter(sizeObj => sizeObj.size !== sizeToRemove);
        setData('sizes', updatedSizes);
    };

    const updateSalePrice = (index, newPrice) => {
        const updatedSizes = [...data.sizes];
        updatedSizes[index].sale_price = newPrice;
        setData('sizes', updatedSizes);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('products.update', product.id), {
            onSuccess: () => {
                toast.success('Product updated successfully');
            },
            onError: () => {
                toast.error('Failed to update product');
                console.error(errors);
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
            <Head title="Edit Product"/>
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

                            {data.product_type === 'weight' && (
                                <div className="mb-4 w-full">
                                    <Label htmlFor='weight_per_item' required title='Weight Per Item' suffix='KG'/>
                                    <TextInput
                                        type="number"
                                        id="weight_per_item"
                                        value={data.weight_per_item}
                                        onChange={(e) => setData('weight_per_item', parseInt(e.target.value))}
                                        className={`w-full ${errors.weight_per_item ? 'border-red-600' : ''}`}
                                    />
                                    {errors.weight_per_item &&
                                        <div className="text-red-600 text-sm">{errors.weight_per_item}</div>}
                                </div>
                            )}

                            <div className="mb-4 w-full">
                                <Label htmlFor='newSize' title='Add Size'/>
                                <div className="flex gap-2 items-center">
                                    <TextInput
                                        id="newSize"
                                        value={newSize}
                                        onChange={(e) => setNewSize(e.target.value)}
                                        placeholder="Enter size (e.g., XS, XXL, Custom)"
                                    />
                                    <IconButton type="button" onClick={addSize} icon={faAdd}/>
                                </div>
                            </div>

                            {data.sizes.length > 0 && (
                                <div className="mb-4 w-full">
                                    <Label title='Sizes & Prices'/>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {data.sizes.map((sizeObj, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col bg-white shadow-md p-4 rounded-lg border border-gray-300"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-semibold text-gray-700">
                                                        Size: {sizeObj.size}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSize(sizeObj.size)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-sm text-gray-600 mr-2">Price:</span>
                                                    <TextInput
                                                        type="number"
                                                        value={sizeObj.sale_price}
                                                        onChange={(e) => updateSalePrice(index, parseInt(e.target.value))}
                                                        placeholder="Enter price"
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className='px-2'>
                                <Button type="submit" disabled={processing}>
                                    Update Product
                                </Button>
                            </div>
                        </div>
                    </form>
                </ShadowBox>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
