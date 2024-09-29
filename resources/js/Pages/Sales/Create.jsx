import React, { useState } from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import Button from "@/Components/Button.jsx";
import InputSelect from "@/Components/InputSelect.jsx";
import PageHeader from "@/Components/PageHeader.jsx";
import BorderButton from "@/Components/BorderButton.jsx";
import TextInput from "@/Components/TextInput.jsx";

const Create = ({ customers, products }) => {
    const { data, setData, post, processing } = useForm({
        customer_id: '',
        products: []
    });

    const [productFields, setProductFields] = useState([{
        product_id: '',
        product_type: '',
        quantity: 1,
        weight: '',
    }]);

    const customerOptions = customers.map(customer => ({
        value: customer.id,
        label: customer.name,
    }));

    const productOptions = products.map(product => ({
        value: product.id,
        label: product.name,
        product_type: product.product_type,
    }));

    const handleAddProduct = () => {
        setProductFields([...productFields, { product_id: '', product_type: '', quantity: 1, weight: '' }]);
    };

    const handleRemoveProduct = (index) => {
        const updatedFields = [...productFields];
        updatedFields.splice(index, 1);
        setProductFields(updatedFields);
    };

    const handleProductChange = (index, field, value) => {
        const updatedFields = [...productFields];
        updatedFields[index][field] = value;

        // Set product_type based on the selected product
        if (field === 'product_id') {
            const selectedProduct = products.find(product => product.id === value);
            updatedFields[index]['product_type'] = selectedProduct ? selectedProduct.product_type : '';
        }

        setProductFields(updatedFields);
        setData('products', updatedFields);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('sales.store'));
    };

    return (
        <AuthenticatedLayout header={<PageHeader title='Add New Sale' />}>
            <Head title="Add Sale" />
            <div className="max-w-[920px] mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <InputSelect
                        id="customer_id"
                        label="Customer"
                        options={customerOptions}
                        value={data.customer_id}
                        onChange={(selected) => setData('customer_id', selected.value)}
                        link={!customers.length ? route('customers.create') : null}
                        linkText="Add customer?"
                        required
                    />

                    {productFields.map((product, index) => (
                        <div key={index} className="mb-4">
                            <InputSelect
                                id={`product_id_${index}`}
                                label="Product"
                                options={productOptions}
                                value={product.product_id}
                                onChange={(selected) => handleProductChange(index, 'product_id', selected.value)}
                                required
                            />

                            {product.product_type === 'weight' && (
                                <TextInput
                                    id={`weight_${index}`}
                                    label="Weight"
                                    type="number"
                                    value={product.weight}
                                    onChange={(e) => handleProductChange(index, 'weight', e.target.value)}
                                    required
                                />
                            )}

                            {product.product_type === 'item' && (
                                <TextInput
                                    id={`quantity_${index}`}
                                    label="Quantity"
                                    type="number"
                                    value={product.quantity}
                                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                    required
                                />
                            )}

                            {index > 0 && (
                                <Button type="button" onClick={() => handleRemoveProduct(index)}>
                                    Remove Product
                                </Button>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-between items-center">
                        <BorderButton type="button" disabled={processing} onClick={handleAddProduct}>
                            Add Product
                        </BorderButton>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Adding..." : "Add Sale"}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
