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
        {name: 'Name', selector: row => row.name},
        {name: 'Phone', selector: row => row.phone},
        {name: 'Email', selector: row => row.email},
        {name: 'Address', selector: row => row.address},
        {name: 'Existing Balance', selector: row => row.existing_balance},
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
        { selector: row => row.phone },
        { selector: row => row.email },
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
            <div className='mx-auto max-w-[96%] py-6'>
                <CustomDataTable
                    title="Customers"
                    data={customers}
                    columns={columns}
                    filterCriteria={filterCriteria}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
