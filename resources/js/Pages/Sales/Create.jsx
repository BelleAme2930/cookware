import React, { useState, useEffect } from 'react';
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
        account_id: '',
        amount_received: 0,
    });

    const [productFields, setProductFields] = useState([{
        product_id: '',
        product_type: '',
        quantity: 1,
        weight: '',
        sale_price: '',
    }]);

    const [totalSalePrice, setTotalSalePrice] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(0);

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
        setProductFields([...productFields, { product_id: '', product_type: '', quantity: 1, weight: '', sale_price: '' }]);
    };

    const handleRemoveProduct = (index) => {
        const updatedFields = [...productFields];
        updatedFields.splice(index, 1);
        setProductFields(updatedFields);
        setData('products', updatedFields);
        calculateTotalSalePrice(updatedFields); // Update total price when a product is removed
    };

    const handleProductChange = (index, field, value) => {
        const updatedFields = [...productFields];
        updatedFields[index][field] = value;

        if (field === 'product_id') {
            const selectedProduct = products.find(product => product.id === value);
            updatedFields[index]['product_type'] = selectedProduct ? selectedProduct.product_type : '';
        }

        // Update total sale price based on weight or sale price changes
        calculateTotalSalePrice(updatedFields);

        setProductFields(updatedFields);
        setData('products', updatedFields);
    };

    const calculateTotalSalePrice = (fields) => {
        let total = 0;
        fields.forEach(product => {
            if (product.product_type === 'weight') {
                const weight = parseFloat(product.weight) || 0;
                const pricePerKg = parseFloat(product.sale_price) || 0;
                total += weight * pricePerKg;
            } else if (product.product_type === 'item') {
                const quantity = parseInt(product.quantity) || 0;
                const pricePerItem = parseFloat(product.sale_price) || 0;
                total += quantity * pricePerItem;
            }
        });
        setTotalSalePrice(total);
        calculateRemainingAmount(data.amount_received, total); // Update remaining amount whenever total changes
    };

    const calculateRemainingAmount = (amountReceived, total) => {
        setRemainingAmount(total - amountReceived);
    };

    // Update remaining amount whenever amount received changes
    useEffect(() => {
        calculateRemainingAmount(data.amount_received, totalSalePrice);
    }, [data.amount_received, totalSalePrice]);

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
            <div className="max-w-[96%] mx-auto p-4 border border-gray-300 mt-6 bg-white">
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

                        const filteredProductOptions = getProductOptions(selectedProductIds);

                        const selectedProduct = products.find(p => p.id === product.product_id);

                        return (
                            <div key={index}
                                 className={`mb-4 py-5 px-4 border border-gray-300 rounded-md relative !bg-gray-50`}>
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
                                        <Label title='Weight' htmlFor={`weight_${index}`}
                                               suffix={selectedProduct && 'Available Inventory: ' + selectedProduct?.weight + ' KG'}/>
                                        <TextInput
                                            id={`weight_${index}`}
                                            label="Weight"
                                            type="number"
                                            value={product.weight}
                                            max={selectedProduct?.weight}
                                            onChange={(e) => handleProductChange(index, 'weight', parseFloat(e.target.value))}
                                            required
                                        />

                                        <div className='mt-4'>
                                            <Label title='Sale Price per KG' htmlFor={`price_${index}`}/>
                                            <TextInput
                                                id={`price_${index}`}
                                                label="Price"
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
                                        <Label title='Quantity' htmlFor={`quantity_${index}`}
                                               suffix={'Inventory: ' + selectedProduct.quantity + ' pcs'}/>
                                        <TextInput
                                            id={`quantity_${index}`}
                                            label="Quantity"
                                            type="number"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                                            required
                                        />

                                        <div className='mt-4'>
                                            <Label title='Sale Price per Item' htmlFor={`price_${index}`}/>
                                            <TextInput
                                                id={`price_${index}`}
                                                label="Price"
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

                    <div className='text-center'>
                        <h1 className='text-xl font-semibold'>Total Sale Price: {totalSalePrice}</h1>
                    </div>

                    <InputSelect
                        id="payment_method"
                        label="Payment Method"
                        options={[
                            { value: 'cash', label: 'Full Cash' },
                            { value: 'account', label: 'Full in Account' },
                            { value: 'half_cash_half_account', label: 'Half Cash + Half in Account' },
                            { value: 'credit', label: 'Full Credit' },
                            { value: 'half_cash_half_credit', label: 'Half Cash + Half Credit' },
                            { value: 'half_account_half_credit', label: 'Half in Account + Half Credit' },
                        ]}
                        onChange={(option) => setData('payment_method', option.value)}
                        value={data.payment_method}
                        required
                    />

                    {(data.payment_method === 'account' || data.payment_method === 'half_cash_half_account' || data.payment_method === 'half_account_half_credit') && (
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

                    {(data.payment_method === 'half_cash_half_credit' || data.payment_method === 'half_account_half_credit') && (
                        <div className="mb-4">
                            <Label htmlFor="amount_received" title="Amount Received" suffix={`Remaining Amount: ${remainingAmount}`}/>
                            <TextInput
                                id="amount_received"
                                type="number"
                                value={data.amount_received}
                                onChange={(e) => setData('amount_received', parseFloat(e.target.value))}
                                required
                                className='w-full'
                            />
                        </div>
                    )}

                    {(data.payment_method === 'credit' || data.payment_method === 'half_cash_half_credit' || data.payment_method === 'half_account_half_credit') && (
                        <div className="mb-4">
                            <Label htmlFor="due_date" title="Due Date"/>
                            <TextInput
                                id="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                required
                                className='w-full'
                            />
                        </div>
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
