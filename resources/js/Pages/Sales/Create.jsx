import React, { useState } from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import Button from "@/Components/Button.jsx";
import InputSelect from "@/Components/InputSelect.jsx";
import PageHeader from "@/Components/PageHeader.jsx";
import BorderButton from "@/Components/BorderButton.jsx";
import TextInput from "@/Components/TextInput.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Label from "@/Components/Label.jsx";

const Create = ({ customers, products, accounts }) => {
    const { data, setData, post, processing } = useForm({
        customer_id: '',
        products: [],
        due_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        account_id: ''
    });

    const [productFields, setProductFields] = useState([{
        product_id: '',
        product_type: '',
        quantity: 0,
        weight: '',
        sale_price: 0,
    }]);

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

    const handleAddProduct = () => {
        setProductFields([...productFields, { product_id: '', product_type: '', quantity: 1, weight: '', sale_price: 0 }]);
    };

    const handleRemoveProduct = (index) => {
        const updatedFields = [...productFields];
        updatedFields.splice(index, 1);
        setProductFields(updatedFields);
        setData('products', updatedFields);
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
        post(route('sales.store'));
    };

    const accountOptions = accounts.map(acc => ({
        value: acc.id,
        label: `${acc.title} - ${acc.bank_name}`,
    }));

    return (
        <AuthenticatedLayout header={<PageHeader title='Add New Sale' />}>
            <Head title="Add Sale" />
            <div className="max-w-[90%] mx-auto p-4 border border-gray-300 mt-6 bg-white">
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

                    {productFields.map((product, index) => {

                        const selectedProductIds = productFields
                            .filter((_, i) => i !== index)
                            .map(field => field.product_id);

                        const selectedProduct = products.find(p => p.id === product.product_id);

                        const filteredProductOptions = getProductOptions(selectedProductIds);
                        const availableWeight = selectedProduct?.weight - (product.weight || 0);
                        const availableQuantity = selectedProduct?.quantity - (product.quantity || 0);

                        return (
                            <div key={index} className={`mb-4 py-5 px-4 border border-gray-300 rounded-md relative bg-white !bg-gray-50`}>

                                <InputSelect
                                    id={`product_id_${index}`}
                                    label={`Product ${index + 1}`}
                                    options={filteredProductOptions}
                                    value={product.product_id}
                                    onChange={(selected) => handleProductChange(index, 'product_id', selected.value)}
                                    link={!products.length ? route('products.create') : null}
                                    linkText="Add product?"
                                    required
                                />

                                {product.product_type === 'weight' && (
                                    <>
                                        <Label
                                            title='Weight'
                                            htmlFor={`weight_${index}`}
                                            suffix={`Available Weight: ${availableWeight} KG`}
                                            suffixStyle={availableWeight < 0 ? 'text-red-600' : 'text-gray-700'}
                                        />
                                        <TextInput
                                            id={`weight_${index}`}
                                            label="Weight"
                                            type="number"
                                            value={product.weight}
                                            onChange={(e) => handleProductChange(index, 'weight', parseFloat(e.target.value))}
                                            required
                                            max={selectedProduct.weight + Math.abs(availableWeight)}
                                        />
                                        <div className='mt-4'>
                                            <Label
                                                title='Sale Price'
                                                htmlFor={`sale_price_${index}`}
                                                suffix={`Default Sale Price: ${selectedProduct.sale_price} Rs`}
                                            />
                                            <TextInput
                                                id={`sale_price_${index}`}
                                                label="Sale Price"
                                                type="number"
                                                value={product.sale_price}
                                                onChange={(e) => handleProductChange(index, 'sale_price', parseFloat(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {product.product_type === 'item' && (
                                    <>
                                        <Label
                                            title='Quantity'
                                            htmlFor={`quantity_${index}`}
                                            suffix={`Available Stock: ${availableQuantity} pcs`}
                                            suffixStyle={availableQuantity < 0 ? 'text-red-600' : 'text-gray-500'} // Change color based on value
                                        />
                                        <TextInput
                                            id={`quantity_${index}`}
                                            label="Quantity"
                                            type="number"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                                            required
                                        />
                                        <div className='mt-4'>
                                            <Label
                                                title='Sale Price'
                                                htmlFor={`sale_price_${index}`}
                                                suffix={`Default Sale Price: ${selectedProduct.sale_price} Rs`}
                                            />
                                            <TextInput
                                                id={`sale_price_${index}`}
                                                label="Sale Price"
                                                type="number"
                                                value={product.sale_price}
                                                onChange={(e) => handleProductChange(index, 'sale_price', parseFloat(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </>
                                )}


                                {index > 0 && (
                                    <IconButton
                                        icon={faTrash}
                                        type="button"
                                        onClick={() => handleRemoveProduct(index)}
                                        className="absolute top-2 right-2 text-red-500"
                                    />
                                )}
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
                            className='w-full'
                        />
                    </div>

                    <InputSelect
                        id="payment_method"
                        label="Payment Method"
                        options={[
                            { value: 'cash', label: 'Cash' },
                            { value: 'account', label: 'Account' },
                            { value: 'credit', label: 'Credit' }
                        ]}
                        onChange={(option) => setData('payment_method', option.value)}
                        value={data.payment_method}
                        required
                    />

                    {data.payment_method === 'account' && (
                        <InputSelect
                            id="account_id"
                            label="Select Account"
                            options={accountOptions}
                            value={data.account_id}
                            onChange={(selected) => setData('account_id', selected.value)}
                            link={!accounts.length ? route('accounts.create') : null}
                            linkText="Add account?"
                            required
                        />
                    )}

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
