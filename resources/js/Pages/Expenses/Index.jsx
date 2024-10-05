import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { faAdd, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Index = ({ expenses }) => {
    const editRoute = (id) => route('expenses.edit', id);
    const deleteRoute = (id) => route('expenses.destroy', id);

    const columns = [
        { name: 'Name', selector: row => row.name },
        { name: 'Amount', selector: row => row.amount },
        { name: 'Description', selector: row => row.description },
        { name: 'Expense Date', selector: row => row.expense_date },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <IconButton onClick={() => router.visit(editRoute(row.id))} icon={faEdit} />
                    <IconButton onClick={() => confirmDelete(row.id)} icon={faTrash} />
                </div>
            )
        },
    ];

    const filterCriteria = [
        { selector: row => row.name },
        { selector: row => row.description },
    ];

    const confirmDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            router.delete(deleteRoute(id), {
                onSuccess: () => {
                    toast.success('Expense deleted successfully.');
                },
                onError: () => {
                    toast.error('Failed to delete expense.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Expenses</h2>
                    <PrimaryIconLink href={route('expenses.create')} icon={faAdd}>Add Expense</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Expenses" />
            <div className='mx-auto max-w-[96%] py-6'>
                <CustomDataTable
                    title="Expenses"
                    data={expenses.data}
                    columns={columns}
                    filterCriteria={filterCriteria}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
