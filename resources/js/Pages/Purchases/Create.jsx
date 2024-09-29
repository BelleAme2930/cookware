import React, { useEffect } from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";
import InputSelect from "@/Components/InputSelect.jsx";
import Label from "@/Components/Label.jsx";

const Create = ({ products }) => {
    const { data, setData, post, errors, processing, reset } = useForm({
        product_id: '',
        price: 0,
        quantity: 0,
        weight: 0,
        product_type: '', // Add this to keep track of the selected product's type
    });

    // Prepare product options for the dropdown
    const productOptions = products.map(product => ({
        value: product.id,
        label: product.name,
        type: product.product_type // Add product type here
    }));

    // Update product type when product_id changes
    useEffect(() => {
        const selectedProduct = products.find(product => product.id === data.product_id);
        if (selectedProduct) {
            setData('product_type', selectedProduct.product_type); // Set product_type based on selected product
        } else {
            setData('product_type', ''); // Reset if no product is selected
        }
    }, [data.product_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('purchases.store'), {
            onSuccess: () => {
                toast.success('Purchase created successfully');
                reset();
            },
            onError: () => {
                toast.error('Failed to create purchase');
                console.error(errors);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Create New Purchase</h2>
                </div>
            }
        >
            <Head title="Create Purchase" />
            <div className="max-w-[800px] mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-wrap'>
                        <InputSelect
                            id="product_id"
                            label="Select Product"
                            options={productOptions}
                            value={data.product_id}
                            onChange={(value) => setData('product_id', value.value)}
                            required
                            link={route('products.create')}
                            linkText='Add a new product?'
                        />
                        {errors.product_id && <div className="text-red-600 text-sm">{errors.product_id}</div>}

                        {data.product_type === 'weight' ? (
                            <>
                                <div className="mb-4 w-full">
                                    <Label title='Weight (KG)' htmlFor='weight' />
                                    <TextInput
                                        type="number"
                                        id="weight"
                                        value={data.weight}
                                        onChange={(e) => setData('weight', parseFloat(e.target.value) || 0)}
                                        required
                                        className={`w-full ${errors.weight ? 'border-red-600' : ''}`}
                                    />
                                    {errors.weight && <div className="text-red-600 text-sm">{errors.weight}</div>}
                                </div>

                                <div className="mb-4 w-full">
                                    <Label title='Price Per KG' htmlFor='price' />
                                    <TextInput
                                        type="number"
                                        id="price"
                                        value={data.price}
                                        onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                                        required
                                        className={`w-full ${errors.price ? 'border-red-600' : ''}`}
                                    />
                                    {errors.price && <div className="text-red-600 text-sm">{errors.price}</div>}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-4 w-full">
                                    <Label title='Quantity' htmlFor='quantity' />
                                    <TextInput
                                        type="number"
                                        id="quantity"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', parseFloat(e.target.value) || 0)}
                                        required
                                        className={`w-full ${errors.quantity ? 'border-red-600' : ''}`}
                                    />
                                    {errors.quantity && <div className="text-red-600 text-sm">{errors.quantity}</div>}
                                </div>

                                <div className="mb-4 w-full">
                                    <Label title='Price Per Item' htmlFor='price' />
                                    <TextInput
                                        type="number"
                                        id="price"
                                        value={data.price}
                                        onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                                        required
                                        className={`w-full ${errors.price ? 'border-red-600' : ''}`}
                                    />
                                    {errors.price && <div className="text-red-600 text-sm">{errors.price}</div>}
                                </div>
                            </>
                        )}
                    </div>
                    <div className='flex items-center justify-end'>
                        <Button type="submit" disabled={processing}>
                            Add Purchase
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
