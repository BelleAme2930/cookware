import React, {useState} from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";
import Textarea from "@/Components/Textarea.jsx";
import ShadowBox from "@/Components/ShadowBox.jsx";

const Create = () => {
    const { data, setData, post, errors, processing, reset } = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        existing_balance: 0,
        advance_balance: 0,
    });

    const [selectedBalance, setSelectedBalance] = useState('existing_balance');

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
            <div className="max-w-[900px] mx-auto p-4">
                <ShadowBox>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label title='Supplier Name' required htmlFor='name'/>
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
                        <div className="mb-4">
                            <Label title='Select Balance Type'/>
                            <div className="flex items-center gap-4">
                                <label className='flex gap-2 items-center'>
                                    <input
                                        type="radio"
                                        name="balance_type"
                                        value="existing_balance"
                                        checked={selectedBalance === 'existing_balance'}
                                        onChange={() => setSelectedBalance('existing_balance')}
                                    />
                                    <span>Existing Balance</span>
                                </label>
                                <label className='flex gap-2 items-center'>
                                    <input
                                        type="radio"
                                        name="balance_type"
                                        value="advance_balance"
                                        checked={selectedBalance === 'advance_balance'}
                                        onChange={() => setSelectedBalance('advance_balance')}
                                    />
                                    <span>Advance Balance</span>
                                </label>
                            </div>
                        </div>
                        {selectedBalance === 'existing_balance' && (
                            <div className="mb-4">
                                <Label title='Existing Balance' htmlFor='existing_balance'/>
                                <TextInput
                                    id="existing_balance"
                                    value={data.existing_balance || 0}
                                    onChange={(e) => setData('existing_balance', parseInt(e.target.value))}
                                    className={`w-full ${errors.existing_balance ? 'border-red-600' : ''}`}
                                />
                                {errors.existing_balance && <div className="text-red-600 text-sm">{errors.existing_balance}</div>}
                            </div>
                        )}
                        {selectedBalance === 'advance_balance' && (
                            <div className="mb-4">
                                <Label title='Advance Balance' htmlFor='advance_balance'/>
                                <TextInput
                                    id="advance_balance"
                                    value={data.advance_balance || 0}
                                    onChange={(e) => setData('advance_balance', parseInt(e.target.value))}
                                    className={`w-full ${errors.advance_balance ? 'border-red-600' : ''}`}
                                />
                                {errors.advance_balance && <div className="text-red-600 text-sm">{errors.advance_balance}</div>}
                            </div>
                        )}
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            Add Supplier
                        </Button>
                    </form>
                </ShadowBox>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
