import React, {useState} from 'react';
import {Head, useForm} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import Button from "@/Components/Button.jsx";
import InputSelect from "@/Components/InputSelect.jsx";
import PageHeader from "@/Components/PageHeader.jsx";
import BorderButton from "@/Components/BorderButton.jsx";
import TextInput from "@/Components/TextInput.jsx";
import IconButton from "@/Components/IconButton.jsx";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import InputLabel from "@/Components/InputLabel.jsx";
import Label from "@/Components/Label.jsx";

const Create = ({customers, products, accounts}) => {
    const {data, setData, post, processing} = useForm({
        customer_id: '',
        products: [],
        due_date: new Date().toISOString().split('T')[0],
        payment_method: '',
        account_id: ''
    });

    const [productFields, setProductFields] = useState([{
        product_id: '',
        product_type: '',
        quantity: 0,
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
        setProductFields([...productFields, {product_id: '', product_type: '', quantity: 1, weight: ''}]);
    };

    const handleRemoveProduct = (index) => {
        const updatedFields = [...productFields];
        updatedFields.splice(index, 1);
        setProductFields(updatedFields);
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
        <AuthenticatedLayout header={<PageHeader title='Add New Sale'/>}>
            <Head title="Add Sale"/>
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
                        <div key={index} className="mb-4 relative">
                            <InputSelect
                                id={`product_id_${index}`}
                                label="Product"
                                options={productOptions}
                                value={product.product_id}
                                onChange={(selected) => handleProductChange(index, 'product_id', selected.value)}
                                required
                            />

                            {product.product_type === 'weight' && (
                                <>
                                    <Label title='Weight' htmlFor={`weight_${index}`}/>
                                    <TextInput
                                        id={`weight_${index}`}
                                        label="Weight"
                                        type="number"
                                        value={product.weight}
                                        onChange={(e) => handleProductChange(index, 'weight', parseFloat(e.target.value))}
                                        required
                                    /></>
                            )}

                            {product.product_type === 'item' && (
                                <>
                                    <Label title='Quantity' htmlFor={`quantity_${index}`}/>
                                    <TextInput
                                        id={`quantity_${index}`}
                                        label="Quantity"
                                        type="number"
                                        value={product.quantity}
                                        onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                                        required
                                    />
                                </>
                            )}

                            {index > 0 && (
                                <IconButton
                                    icon={faTrash}
                                    type="button"
                                    onClick={() => handleRemoveProduct(index)}
                                    className="absolute -top-2 -left-16 mt-4 mr-4"
                                />
                            )}
                        </div>
                    ))}

                    <div className="mb-4">
                        <InputLabel htmlFor="due_date" value="Due Date"/>

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
                            {value: 'cash', label: 'Cash'},
                            {value: 'account', label: 'Account'}
                        ]}
                        onChange={(option) => setData('payment_method', option.value)}
                        value={data.payment_method}
                        link={!accounts.length ? route('accounts.create') : null}
                        linkText="Add account?"
                        required
                    />

                    {data.payment_method === 'account' && (
                        <InputSelect
                            id="account_id"
                            label="Select Account"
                            options={accountOptions}
                            value={data.account_id}
                            onChange={(selected) => setData('account_id', selected.value)}
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
