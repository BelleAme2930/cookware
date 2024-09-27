import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";

const Create = () => {
    const { data, setData, post, errors, processing, reset } = useForm({
        name: '',
        phone: '',
        email: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customers.store'), {
            onSuccess: () => {
                toast.success('Customer added successfully');
                reset();
            },
            onError: () => {
                toast.error('Failed to add customer');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Add New Customer</h2>
                </div>
            }
        >
            <Head title="Add Customer" />
            <div className="max-w-lg mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label title='Customer Name' htmlFor='name' />
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
                        <Label title='Phone Number' htmlFor='phone' />
                        <TextInput
                            id="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className={`w-full ${errors.phone ? 'border-red-600' : ''}`}
                        />
                        {errors.phone && <div className="text-red-600 text-sm">{errors.phone}</div>}
                    </div>
                    <div className="mb-4">
                        <Label title='Email' htmlFor='email' />
                        <TextInput
                            id="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            type="email"
                            className={`w-full ${errors.email ? 'border-red-600' : ''}`}
                        />
                        {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
                    </div>
                    <Button
                        type="submit"
                        disabled={processing}
                    >
                        Add Customer
                    </Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
