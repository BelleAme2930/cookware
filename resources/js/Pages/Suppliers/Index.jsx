import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { faAdd, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Index = ({ suppliers }) => {
    const editRoute = (id) => route('suppliers.edit', id);
    const deleteRoute = (id) => route('suppliers.destroy', id);

    const columns = [
        {name: 'Name', selector: row => row.name},
        {name: 'Phone', selector: row => row.phone},
        {name: 'Email', selector: row => row.email},
        {name: 'Address', selector: row => row.address},
        {name: 'Created Date', selector: row => row.created_at},
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
        { selector: row => row.address },
    ];

    const confirmDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            router.delete(deleteRoute(id), {
                onSuccess: () => {
                    toast.success('Supplier deleted successfully.');
                },
                onError: () => {
                    toast.error('Failed to delete supplier.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Suppliers</h2>
                    <PrimaryIconLink href={route('suppliers.create')} icon={faAdd}>Add Supplier</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Suppliers" />
            <div className='mx-auto max-w-[90%] py-6'>
                <CustomDataTable
                    title="Suppliers"
                    data={suppliers}
                    columns={columns}
                    filterCriteria={filterCriteria}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
