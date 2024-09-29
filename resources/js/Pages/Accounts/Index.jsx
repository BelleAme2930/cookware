import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { faAdd, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Index = ({ accounts }) => {
    const editRoute = (id) => route('accounts.edit', id);
    const deleteRoute = (id) => route('accounts.destroy', id);

    const columns = [
        { name: 'ID', selector: row => row.id, sortable: true },
        { name: 'Title', selector: row => row.title, sortable: true },
        { name: 'Account Number', selector: row => row.account_number, sortable: true },
        { name: 'Bank Name', selector: row => row.bank_name, sortable: true },
        { name: 'Created Date', selector: row => row.created_at, sortable: true },
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

    const confirmDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this account?")) {
            router.delete(deleteRoute(id), {
                onSuccess: () => {
                    toast.success('Account deleted successfully.');
                },
                onError: () => {
                    toast.error('Failed to delete account.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Accounts</h2>
                    <PrimaryIconLink href={route('accounts.create')} icon={faAdd}>Add Account</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Accounts" />
            <div className='mx-auto max-w-[90%] py-6'>
                <CustomDataTable
                    searchLabel='Filter by Account:'
                    title="Accounts"
                    data={accounts.data}
                    columns={columns}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
