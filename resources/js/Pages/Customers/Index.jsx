import React from 'react';
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { faAdd, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";

const Index = ({ customers }) => {
    const editRoute = (id) => route('customers.edit', id);
    const deleteRoute = (id) => route('customers.destroy', id);

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
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
        if (window.confirm("Are you sure you want to delete this customer?")) {
            router.delete(deleteRoute(id), {
                onSuccess: () => {
                    toast.success('Customer deleted successfully.');
                },
                onError: () => {
                    toast.error('Failed to delete customer.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Customers</h2>
                    <PrimaryIconLink href={route('customers.create')} icon={faAdd}>Add Customer</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Customers" />
            <div className='mx-auto max-w-[90%] py-6'>
                <CustomDataTable
                    searchLabel='Filter by Customer:'
                    title="Customers"
                    data={customers}
                    columns={columns}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
