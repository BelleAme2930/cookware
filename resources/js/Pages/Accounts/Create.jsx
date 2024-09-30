import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";
import ShadowBox from "@/Components/ShadowBox.jsx";

const Create = () => {
    const { data, setData, post, errors, processing, reset } = useForm({
        title: '',
        account_number: '',
        bank_name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('accounts.store'), {
            onSuccess: () => {
                toast.success('Account added successfully');
                reset();
            },
            onError: () => {
                toast.error('Failed to add account');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Add New Account</h2>
                </div>
            }
        >
            <Head title="Accounts" />
            <div className="max-w-[900px] mx-auto p-4">
                <ShadowBox>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label title='Account Title' required={true} htmlFor='title'/>
                            <TextInput
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className={`w-full ${errors.title ? 'border-red-600' : ''}`}
                            />
                            {errors.title && <div className="text-red-600 text-sm">{errors.title}</div>}
                        </div>
                        <div className="mb-4">
                            <Label title='Account Number' required={true} htmlFor='account_number'/>
                            <TextInput
                                id="account_number"
                                value={data.account_number}
                                onChange={(e) => setData('account_number', e.target.value)}
                                className={`w-full ${errors.account_number ? 'border-red-600' : ''}`}
                            />
                            {errors.account_number &&
                                <div className="text-red-600 text-sm">{errors.account_number}</div>}
                        </div>
                        <div className="mb-4">
                            <Label title='Bank Name' required={true} htmlFor='bank_name'/>
                            <TextInput
                                id="bank_name"
                                value={data.bank_name}
                                onChange={(e) => setData('bank_name', e.target.value)}
                                className={`w-full ${errors.bank_name ? 'border-red-600' : ''}`}
                            />
                            {errors.bank_name && <div className="text-red-600 text-sm">{errors.bank_name}</div>}
                        </div>
                        <Button type="submit" disabled={processing}>
                            Add Account
                        </Button>
                    </form>
                </ShadowBox>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
