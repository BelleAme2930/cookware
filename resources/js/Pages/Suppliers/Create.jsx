import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";
import Textarea from "@/Components/Textarea.jsx";

const Create = () => {
    const { data, setData, post, errors, processing, reset } = useForm({
        name: '',
        phone: '',
        address: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('suppliers.store'), {
            onSuccess: () => {
                toast.success('Supplier added successfully');
                reset();
            },
            onError: () => {
                toast.error('Failed to add supplier');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Add New Supplier</h2>
                </div>
            }
        >
            <Head title="Add Supplier" />
            <div className="max-w-lg mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label title='Supplier Name' required htmlFor='name' />
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
                    <div className="mb-4">
                        <Label title='Address' htmlFor='address' />
                        <Textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className={`w-full ${errors.address ? 'border-red-600' : ''}`}
                        />
                        {errors.address && <div className="text-red-600 text-sm">{errors.address}</div>}
                    </div>
                    <Button
                        type="submit"
                        disabled={processing}
                    >
                        Add Supplier
                    </Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
