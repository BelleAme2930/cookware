import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";

const Edit = ({ supplier }) => {
    const { data, setData, put, errors, processing } = useForm({
        name: supplier.name,
        phone: supplier.phone,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('suppliers.update', supplier.id), {
            onSuccess: () => {
                toast.success('Supplier updated successfully');
            },
            onError: () => {
                toast.error('Failed to update supplier');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Edit Supplier</h2>
                </div>
            }
        >
            <Head title="Edit Supplier" />
            <div className="max-w-lg mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label title='Supplier Name' htmlFor='name' />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className={`w-full ${errors.name ? 'border-red-600' : ''}`}
                        />
                        {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                    </div>
                    <div className="mb-4">
                        <Label title='Phone' htmlFor='phone' />
                        <TextInput
                            id="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className={`w-full ${errors.phone ? 'border-red-600' : ''}`}
                        />
                        {errors.phone && <div className="text-red-600 text-sm">{errors.phone}</div>}
                    </div>
                    <Button
                        type="submit"
                        disabled={processing}
                    >
                        Update Supplier
                    </Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
