import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { faAdd, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Index = ({ sales }) => {

    const editRoute = (id) => route('sales.edit', id);
    const deleteRoute = (id) => route('sales.destroy', id);

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
            selector: row => row.product.name,
            sortable: true,
        },
        {
            name: 'Weight (kg)',
            selector: row => row.weight || '-',
            sortable: false,
        },
        {
            name: 'Quantity',
            selector: row => row.quantity || '-',
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
        if (window.confirm("Are you sure you want to delete this sale?")) {
            router.delete(deleteRoute(id), {
                onSuccess: () => {
                    toast.success('Sale deleted successfully.');
                },
                onError: () => {
                    toast.error('Failed to delete sale.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Sales</h2>
                    <PrimaryIconLink href={route('sales.create')} icon={faAdd}>Add Sale</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Sales" />
            <div className='mx-auto max-w-[90%] py-6'>
                <CustomDataTable
                    searchLabel='Filter by Sale:'
                    title="Sales"
                    data={sales.data}
                    columns={columns}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
