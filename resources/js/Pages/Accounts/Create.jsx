import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";
import ShadowBox from "@/Components/ShadowBox.jsx";
import InputSelect from "@/Components/InputSelect.jsx";

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

    // Options for the bank_name select input
    const bankOptions = [
        { value: 'Bank Alfalah', label: 'Bank Alfalah' },
        { value: 'HBL Bank', label: 'HBL Bank' },
        { value: 'UBL Bank', label: 'UBL Bank' },
        { value: 'Meezan Bank', label: 'Meezan Bank' },
        { value: 'Jazzcash', label: 'Jazzcash' },
        { value: 'Easypaisa', label: 'Easypaisa' },
        { value: 'Nayapay', label: 'Nayapay' },
    ];

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
                            <InputSelect
                                id="bank_name"
                                label="Bank Name"
                                options={bankOptions}
                                value={data.bank_name}
                                onChange={(option) => setData('bank_name', option ? option.value : '')}
                                error={!!errors.bank_name}
                                required={true}
                                errorMsg={errors.bank_name}
                                className="w-full"
                            />
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
