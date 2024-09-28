import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Index = ({ transactions }) => {
    const deleteRoute = (id) => route('sales.destroy', id);

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Customer',
            selector: row => row.customer.name, // Assuming customer has a 'name' field
            sortable: true,
        },
        {
            name: 'Product',
            selector: row => row.product.name, // Assuming product has a 'name' field
            sortable: true,
        },
        {
            name: 'Quantity (g)',
            selector: row => row.quantity, // This is in grams
            sortable: true,
        },
        {
            name: 'Total Price',
            selector: row => `$${(row.total_price / 100).toFixed(2)}`, // Assuming total_price is stored in cents
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
                    <IconButton onClick={() => confirmDelete(row.id)} icon={faTrash} />
                </div>
            ),
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
            header={<h2 className="text-lg leading-tight text-gray-800">Sales Transactions</h2>}
        >
            <Head title="Sales Transactions" />
            <div className='mx-auto max-w-[90%] py-6'>
                <CustomDataTable
                    searchLabel='Filter by Transaction:'
                    title="Sales Transactions"
                    data={transactions}
                    columns={columns}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
