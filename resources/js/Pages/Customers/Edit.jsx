import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";
import Textarea from "@/Components/Textarea.jsx";
import ShadowBox from "@/Components/ShadowBox.jsx";

const Edit = ({ customer }) => {
    const { data, setData, put, errors, processing } = useForm({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('customers.update', customer.id), {
            onSuccess: () => {
                toast.success('Customer updated successfully');
            },
            onError: () => {
                toast.error('Failed to update customer');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Edit Customer</h2>
                </div>
            }
        >
            <Head title="Edit Customer" />
            <div className="max-w-[900px] mx-auto p-4">
                <ShadowBox>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label title='Customer Name' htmlFor='name'/>
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
                            <Label title='Phone Number' htmlFor='phone'/>
                            <TextInput
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className={`w-full ${errors.phone ? 'border-red-600' : ''}`}
                            />
                            {errors.phone && <div className="text-red-600 text-sm">{errors.phone}</div>}
                        </div>
                        <div className="mb-4">
                            <Label title='Email' htmlFor='email'/>
                            <TextInput
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                type="email"
                                className={`w-full ${errors.email ? 'border-red-600' : ''}`}
                            />
                            {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
                        </div>
                        <div className="mb-4">
                            <Label title='Address' htmlFor='address'/>
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
                            Update Customer
                        </Button>
                    </form>
                </ShadowBox>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
