import React from 'react';
import {Head, useForm} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Button from "@/Components/Button.jsx";
import {toast} from "react-toastify";
import InputSelect from "@/Components/InputSelect.jsx";
import Label from "@/Components/Label.jsx";
import ShadowBox from "@/Components/ShadowBox.jsx";

const Create = ({categories, suppliers}) => {
    const {data, setData, post, errors, processing, reset} = useForm({
        name: '',
        category_id: '',
        supplier_id: '',
        sale_price: 1,
        product_type: 'weight',
        weight_per_item: 1,
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
                                    {label: 'Per KG', value: 'weight'},
                                    {label: 'Per Item', value: 'item'},
                                ]}
                                value={data.product_type}
                                onChange={(value) => setData('product_type', value.value)}
                                required
                            />

                            <div className="mb-4 w-full">
                                <Label htmlFor='weight_per_item' required title='Weight Per Item' suffix='KG'/>
                                <TextInput
                                    type="number"
                                    id="weight_per_item"
                                    value={data.weight_per_item}
                                    onChange={(e) => setData('weight_per_item', parseInt(e.target.value))}
                                    required
                                    className={`w-full ${errors.weight_per_item ? 'border-red-600' : ''}`}
                                />
                                {errors.weight_per_item &&
                                    <div className="text-red-600 text-sm">{errors.weight_per_item}</div>}
                            </div>

                            <div className="mb-4 w-full">
                                <Label htmlFor='sale_price' required title='Sale Price' suffix='PKR'/>
                                <TextInput
                                    type="number"
                                    id="sale_price"
                                    value={data.sale_price}
                                    onChange={(e) => setData('sale_price', parseInt(e.target.value))}
                                    required
                                    className={`w-full ${errors.sale_price ? 'border-red-600' : ''}`}
                                />
                                {errors.sale_price && <div className="text-red-600 text-sm">{errors.sale_price}</div>}
                            </div>
                        </div>
                        <div className='px-2'>
                            <Button type="submit" disabled={processing}>
                                Add Product
                            </Button>
                        </div>
                    </form>
                </ShadowBox>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
