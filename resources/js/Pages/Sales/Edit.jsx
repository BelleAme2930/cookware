// resources/js/Pages/Sales/Edit.jsx
import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import Button from '@/Components/Button.jsx';
import TextInput from '@/Components/TextInput.jsx';

const Edit = ({ sale, products, customers }) => {
    const { data, setData, put } = useForm({
        customer_id: sale.customer_id,
        products: sale.products.map(p => ({ id: p.id, weight: p.weight })),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('sales.update', sale.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Sale ID: ${sale.id}`} />
            <form onSubmit={handleSubmit}>
                <TextInput
                    type="text"
                    value={data.customer_id}
                    onChange={(e) => setData('customer_id', e.target.value)}
                    placeholder="Customer ID"
                    required
                />
                {data.products.map((product, index) => (
                    <div key={index}>
                        <label>{products.find(p => p.id === product.id)?.name}</label>
                        <input
                            type="number"
                            value={product.weight}
                            onChange={(e) => {
                                const newProducts = [...data.products];
                                newProducts[index].weight = parseInt(e.target.value);
                                setData('products', newProducts);
                            }}
                        />
                    </div>
                ))}
                <Button type="submit">Update Sale</Button>
            </form>
        </AuthenticatedLayout>
    );
};

export default Edit;
