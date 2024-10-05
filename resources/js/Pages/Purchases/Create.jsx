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

const Create = ({ suppliers, products, accounts }) => {
    const { data, setData, post, processing } = useForm({
        supplier_id: '',
        products: [],
        due_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        account_id: '',
        semi_credit_amount: 0,
    });

    const [productFields, setProductFields] = useState([{
        product_id: '',
        product_type: '',
        quantity: 0,
        weight: '',
        purchase_price: '',
    }]);

    const supplierOptions = suppliers.map(supplier => ({
        value: supplier.id,
        label: supplier.name,
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
        setProductFields([...productFields, { product_id: '', product_type: '', quantity: 1, weight: '', purchase_price: '' }]);
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
        post(route('purchases.store'));
    };

    const accountOptions = accounts.map(acc => ({
        value: acc.id,
        label: `${acc.title} - ${acc.bank_name}`,
    }));

    return (
        <AuthenticatedLayout header={<PageHeader title='Add New Purchase' />}>
            <Head title="Add Purchase" />
            <div className="max-w-[96%] mx-auto p-4 border border-gray-300 mt-6 bg-white">
                <form onSubmit={handleSubmit}>
                    <InputSelect
                        id="supplier_id"
                        label="Supplier"
                        options={supplierOptions}
                        value={data.supplier_id}
                        onChange={(selected) => setData('supplier_id', selected.value)}
                        link={!suppliers.length ? route('suppliers.create') : null}
                        linkText="Add supplier?"
                        required
                    />

                    {productFields.map((product, index) => {
                        const selectedProductIds = productFields
                            .filter((_, i) => i !== index)
                            .map(field => field.product_id);

                        const filteredProductOptions = getProductOptions(selectedProductIds);

                        const selectedProduct = products.find(p => p.id === product.product_id);

                        return (
                            <div key={index} className={`mb-4 py-5 px-4 border border-gray-300 rounded-md relative !bg-gray-50`}>
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
                                        <Label title='Weight' htmlFor={`weight_${index}`} suffix={'Inventory: ' + selectedProduct?.weight + ' KG'}/>
                                        <TextInput
                                            id={`weight_${index}`}
                                            label="Weight"
                                            type="number"
                                            value={product.weight}
                                            onChange={(e) => handleProductChange(index, 'weight', parseFloat(e.target.value))}
                                            required
                                        />

                                        <div className='mt-4'>
                                            <Label title='Purchase Price per KG' htmlFor={`price_${index}`}/>
                                            <TextInput
                                                id={`price_${index}`}
                                                label="Price"
                                                type="number"
                                                value={product.purchase_price}
                                                onChange={(e) => handleProductChange(index, 'purchase_price', parseFloat(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {product.product_type === 'item' && (
                                    <>
                                        <Label title='Quantity' htmlFor={`quantity_${index}`} suffix={'Inventory: ' + selectedProduct.quantity + ' pcs'}/>
                                        <TextInput
                                            id={`quantity_${index}`}
                                            label="Quantity"
                                            type="number"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                                            required
                                        />

                                        <div className='mt-4'>
                                            <Label title='Purchase Price per Item' htmlFor={`price_${index}`}/>
                                            <TextInput
                                                id={`price_${index}`}
                                                label="Price"
                                                type="number"
                                                value={product.purchase_price}
                                                onChange={(e) => handleProductChange(index, 'purchase_price', parseFloat(e.target.value))}
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
                            { value: 'credit', label: 'Credit' },
                            { value: 'semi_credit', label: 'Semi Credit' }
                        ]}
                        onChange={(option) => setData('payment_method', option.value)}
                        value={data.payment_method}
                        required
                    />

                    {data.payment_method === 'semi_credit' && (
                        <div className="mb-4">
                            <Label htmlFor="semi_credit_amount" title="Amount Paid" />
                            <TextInput
                                id="semi_credit_amount"
                                type="number"
                                value={data.semi_credit_amount}
                                onChange={(e) => setData('semi_credit_amount', parseFloat(e.target.value))}
                                required
                                className='w-full'
                            />
                        </div>
                    )}

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
                            {processing ? "Adding..." : "Add Purchase"}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
