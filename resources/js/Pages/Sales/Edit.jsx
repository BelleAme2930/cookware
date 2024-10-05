import React, { useState } from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import Button from "@/Components/Button.jsx";
import InputSelect from "@/Components/InputSelect.jsx";
import PageHeader from "@/Components/PageHeader.jsx";
import TextInput from "@/Components/TextInput.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Label from "@/Components/Label.jsx";

const Edit = ({ sale, customers, products, accounts }) => {
    const { data, setData, put, processing } = useForm({
        customer_id: sale.customer_id,
        products: sale.products.map(product => ({
            product_id: product.id,
            product_type: product.pivot.product_type,
            quantity: product.pivot.quantity || 0,
            weight: product.pivot.weight || '',
            sale_price: product.pivot.sale_price,
        })),
        due_date: sale.due_date,
        payment_method: sale.payment_method,
        account_id: sale.account_id,
    });

    const [productFields, setProductFields] = useState(data.products);

    const customerOptions = customers.map(customer => ({
        value: customer.id,
        label: customer.name,
    }));

    const getProductOptions = (selectedProducts) => {
        return products
            .filter(product => !selectedProducts.includes(product.id))
            .map(product => ({
                value: product.id,
                label: product.name,
                product_type: product.product_type,
            }));
    };

    const handleProductChange = (index, field, value) => {
        const updatedFields = [...productFields];
        updatedFields[index][field] = value;

        if (field === 'product_id') {
            const selectedProduct = products.find(product => product.id === value);
            updatedFields[index]['product_type'] = selectedProduct ? selectedProduct.product_type : '';
        }

        setProductFields(updatedFields);
        setData('products', updatedFields);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('sales.update', sale.id), {
            onSuccess: () => toast.success('Sale updated successfully'),
            onError: () => toast.error('Failed to update sale'),
        });
    };

    const accountOptions = accounts.map(acc => ({
        value: acc.id,
        label: `${acc.title} - ${acc.bank_name}`,
    }));

    return (
        <AuthenticatedLayout header={<PageHeader title='Edit Sale' />}>
            <Head title="Edit Sale" />
            <div className="max-w-[96%] mx-auto p-4 border border-gray-300 mt-6 bg-white">
                <form onSubmit={handleSubmit}>
                    <InputSelect
                        id="customer_id"
                        label="Customer"
                        options={customerOptions}
                        value={data.customer_id}
                        onChange={(selected) => setData('customer_id', selected.value)}
                        required
                    />

                    {productFields.map((product, index) => {
                        const selectedProductIds = productFields
                            .filter((_, i) => i !== index)
                            .map(field => field.product_id);

                        const filteredProductOptions = getProductOptions(selectedProductIds);

                        return (
                            <div key={index} className="mb-4 py-5 px-4 border border-gray-300 rounded-md relative bg-white !bg-gray-50">
                                <InputSelect
                                    id={`product_id_${index}`}
                                    label={`Product ${index + 1}`}
                                    options={filteredProductOptions}
                                    value={product.product_id}
                                    onChange={(selected) => handleProductChange(index, 'product_id', selected.value)}
                                    required
                                />

                                {product.product_type === 'weight' && (
                                    <>
                                        <Label title='Weight' htmlFor={`weight_${index}`} />
                                        <TextInput
                                            id={`weight_${index}`}
                                            type="number"
                                            value={product.weight}
                                            onChange={(e) => handleProductChange(index, 'weight', parseFloat(e.target.value))}
                                            required
                                        />
                                    </>
                                )}

                                {product.product_type === 'item' && (
                                    <>
                                        <Label title='Quantity' htmlFor={`quantity_${index}`} />
                                        <TextInput
                                            id={`quantity_${index}`}
                                            type="number"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                                            required
                                        />
                                    </>
                                )}

                                <Label title='Sale Price' htmlFor={`sale_price_${index}`} />
                                <TextInput
                                    id={`sale_price_${index}`}
                                    type="number"
                                    value={product.sale_price}
                                    onChange={(e) => handleProductChange(index, 'sale_price', parseFloat(e.target.value))}
                                    required
                                />
                            </div>
                        );
                    })}

                    <div className="mb-4">
                        <Label htmlFor="due_date" title="Due Date" />
                        <TextInput
                            id="due_date"
                            type="date"
                            value={data.due_date}
                            onChange={(e) => setData('due_date', e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>

                    <InputSelect
                        id="payment_method"
                        label="Payment Method"
                        options={[
                            { value: 'cash', label: 'Cash' },
                            { value: 'account', label: 'Account' }
                        ]}
                        onChange={(option) => setData('payment_method', option.value)}
                        value={data.payment_method}
                        required
                    />

                    {data.payment_method === 'account' && (
                        <InputSelect
                            id="account_id"
                            label="Account"
                            options={accountOptions}
                            onChange={(option) => setData('account_id', option.value)}
                            value={data.account_id}
                        />
                    )}

                    <Button type="submit" disabled={processing}>Update</Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
