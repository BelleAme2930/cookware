import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { faAdd, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Index = ({ transactions }) => {

    const editRoute = (id) => route('transactions.edit', id);
    const deleteRoute = (id) => route('transactions.destroy', id);

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Customer',
            selector: row => row.customer.name,
            sortable: true,
        },
        {
            name: 'Product',
            selector: row => row.products.map(product => product.name).join(', '),
            sortable: false,
        },
        {
            name: 'Weight (kg)',
            selector: row => row.products.reduce((total, product) => total + product.pivot.weight, 0),
            sortable: false,
        },
        {
            name: 'Total Price',
            selector: row => row.total_price,
            sortable: true,
        },
        {
            name: 'Created Date',
            selector: row => row.created_at,
            sortable: true,
        },
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
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            router.delete(deleteRoute(id), {
                onSuccess: () => {
                    toast.success('Transaction deleted successfully.');
                },
                onError: () => {
                    toast.error('Failed to delete transaction.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Transactions</h2>
                    <PrimaryIconLink href={route('transactions.create')} icon={faAdd}>Add Transaction</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Transactions" />
            <div className='mx-auto max-w-[90%] py-6'>
                <CustomDataTable
                    searchLabel='Filter by Transaction:'
                    title="Transactions"
                    data={transactions.data}
                    columns={columns}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
