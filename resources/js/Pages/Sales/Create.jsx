import React, { useEffect, useState } from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";
import InputSelect from "@/Components/InputSelect.jsx";
import Label from "@/Components/Label.jsx";
import ProductRow from "@/Pages/Sales/Partials/ProductRow.jsx";
import PageHeader from "@/Components/PageHeader.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import BorderButton from "@/Components/BorderButton.jsx";

const Create = ({ customers, products }) => {
    const { data, setData, post, errors, processing, reset } = useForm({
        customer_id: '',
        productWeights: [{ product_id: '', weight: 0 }],
    });

    const [remainingWeights, setRemainingWeights] = useState({});

    useEffect(() => {
        if (products.length > 0 && data.productWeights.length === 0) {
            setData('productWeights', [{ product_id: products[0].id, weight: 0 }]);
        }
    }, [products, data.productWeights.length, setData]);

    const handleAddProduct = () => {
        setData('productWeights', [...data.productWeights, { product_id: '', weight: 0 }]);
    };

    const handleRemoveProduct = (index) => {
        setData('productWeights', data.productWeights.filter((_, i) => i !== index));
    };

    const handleProductChange = (index, value) => {
        const updatedProductWeights = data.productWeights.map((pw, i) => (
            i === index ? { ...pw, product_id: value, weight: '' } : pw
        ));
        setData('productWeights', updatedProductWeights);

        const selectedProduct = products.find(product => product.id === value);
        setRemainingWeights(prevState => ({
            ...prevState,
            [index]: selectedProduct?.available_weight_kg || 0,
        }));
    };

    const handleWeightChange = (index, value) => {
        const inputWeight = parseFloat(value) || 0; // Ensure this is always a number
        const selectedProduct = products.find(p => p.id === data.productWeights[index].product_id);
        const remainingWeight = (selectedProduct?.available_weight_kg || 0) - inputWeight;

        const updatedProductWeights = data.productWeights.map((pw, i) => (
            i === index ? { ...pw, weight: inputWeight } : pw // Store as a number
        ));
        setData('productWeights', updatedProductWeights);

        setRemainingWeights(prevState => ({
            ...prevState,
            [index]: remainingWeight,
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.productWeights.some((pw, i) => {
            const product = products.find(p => p.id === pw.product_id);
            return parseFloat(pw.weight) > (product?.available_weight_kg || 0);
        })) {
            toast.error('One or more products exceed the available weight.');
            return;
        }

        post(route('sales.store'), {
            onSuccess: () => {
                toast.success('Sale added successfully');
                reset();
            },
            onError: (error) => {
                if (error?.errors) {
                    Object.keys(error.errors).forEach(key => {
                        toast.error(`${key}: ${error.errors[key].join(', ')}`);
                    });
                } else {
                    toast.error('Failed to add sale');
                }
            },
        });
    };

    const customerOptions = customers.map(customer => ({
        value: customer.id,
        label: customer.name,
    }));

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
                    {data.productWeights.map((productWeight, index) => (
                        <ProductRow
                            key={index}
                            index={index}
                            productWeight={productWeight}
                            products={products}
                            productWeights={data.productWeights}
                            remainingWeight={remainingWeights[index]}
                            handleProductChange={handleProductChange}
                            handleWeightChange={handleWeightChange}
                            handleRemoveProduct={handleRemoveProduct}
                            errors={errors}
                        />
                    ))}

                    <div className="flex justify-between items-center">
                        <BorderButton type='button' disabled={processing} onClick={handleAddProduct}>
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
