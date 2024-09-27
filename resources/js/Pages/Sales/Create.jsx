import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { toast } from "react-toastify";
import Label from "@/Components/Label.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Button from "@/Components/Button.jsx";

const Create = ({ customers, products }) => {
    const { data, setData, post, errors, processing } = useForm({
        customer_id: '',
        products: [{ id: '', weight: 0 }],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('sales.store'), {
            onSuccess: () => {
                toast.success('Sale recorded successfully');
            },
            onError: () => {
                toast.error('Failed to record sale');
            },
        });
    };

    const addProduct = () => {
        setData('products', [...data.products, { id: '', weight: 0 }]);
    };

    const updateProduct = (index, field, value) => {
        const newProducts = [...data.products];
        newProducts[index][field] = value;
        setData('products', newProducts);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-lg leading-tight text-gray-800">Create Sale</h2>}
        >
            <Head title="Create Sale" />
            <div className="max-w-lg mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label title='Customer' htmlFor='customer_id' />
                        <select
                            id="customer_id"
                            value={data.customer_id}
                            onChange={(e) => setData('customer_id', e.target.value)}
                            required
                            className={`w-full ${errors.customer_id ? 'border-red-600' : ''}`}
                        >
                            <option value="">Select Customer</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>{customer.name}</option>
                            ))}
                        </select>
                        {errors.customer_id && <div className="text-red-600 text-sm">{errors.customer_id}</div>}
                    </div>

                    {data.products.map((product, index) => (
                        <div key={index} className="mb-4">
                            <Label title='Product' htmlFor={`products[${index}].id`} />
                            <select
                                value={product.id}
                                onChange={(e) => updateProduct(index, 'id', e.target.value)}
                                required
                                className={`w-full ${errors.products?.[index]?.id ? 'border-red-600' : ''}`}
                            >
                                <option value="">Select Product</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            {errors.products?.[index]?.id && <div className="text-red-600 text-sm">{errors.products[index].id}</div>}

                            <Label title='Weight' htmlFor={`products[${index}].weight`} />
                            <TextInput
                                type="number"
                                value={product.weight}
                                onChange={(e) => updateProduct(index, 'weight', e.target.value)}
                                required
                                className={`w-full ${errors.products?.[index]?.weight ? 'border-red-600' : ''}`}
                            />
                            {errors.products?.[index]?.weight && <div className="text-red-600 text-sm">{errors.products[index].weight}</div>}
                        </div>
                    ))}

                    <button type="button" onClick={addProduct} className="text-blue-600">Add Another Product</button>

                    <Button type="submit" disabled={processing} className="mt-4">Record Sale</Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
