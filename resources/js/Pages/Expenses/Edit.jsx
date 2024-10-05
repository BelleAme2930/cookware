import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";
import TextArea from "@/Components/Textarea.jsx";
import ShadowBox from "@/Components/ShadowBox.jsx";

const Edit = ({ expense }) => {
    const { data, setData, put, errors, processing } = useForm({
        name: expense.name || '',
        amount: expense.amount || '',
        description: expense.description || '',
        expense_date: expense.expense_date || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('expenses.update', expense.id), {
            onSuccess: () => {
                toast.success('Expense updated successfully');
            },
            onError: () => {
                toast.error('Failed to update expense');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Edit Expense</h2>
                </div>
            }
        >
            <Head title="Edit Expense" />
            <div className="max-w-[900px] mx-auto p-4">
                <ShadowBox>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label title='Expense Name' required={true} htmlFor='name'/>
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full ${errors.name ? 'border-red-600' : ''}`}
                            />
                            {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                        </div>
                        <div className="mb-4">
                            <Label title='Amount' required={true} htmlFor='amount'/>
                            <TextInput
                                type="number"
                                id="amount"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className={`w-full ${errors.amount ? 'border-red-600' : ''}`}
                            />
                            {errors.amount && <div className="text-red-600 text-sm">{errors.amount}</div>}
                        </div>
                        <div className="mb-4">
                            <Label title='Description' htmlFor='description'/>
                            <TextArea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={`w-full ${errors.description ? 'border-red-600' : ''}`}
                                rows={4}
                            />
                            {errors.description && <div className="text-red-600 text-sm">{errors.description}</div>}
                        </div>
                        <div className="mb-4">
                            <Label title='Expense Date' required={true} htmlFor='expense_date'/>
                            <TextInput
                                type="date"
                                id="expense_date"
                                value={data.expense_date}
                                onChange={(e) => setData('expense_date', e.target.value)}
                                className={`w-full ${errors.expense_date ? 'border-red-600' : ''}`}
                            />
                            {errors.expense_date && <div className="text-red-600 text-sm">{errors.expense_date}</div>}
                        </div>
                        <Button type="submit" disabled={processing}>
                            Update Expense
                        </Button>
                    </form>
                </ShadowBox>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
