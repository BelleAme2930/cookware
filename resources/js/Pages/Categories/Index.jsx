import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { faAdd, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Index = ({ categories }) => {

    const editRoute = (id) => route('categories.edit', id);
    const deleteRoute = (id) => route('categories.destroy', id);

    const columns = [
        {name: 'Name', selector: row => row.name},
        {name: 'Description', selector: row => row.description},
        {name: 'Category Stock', selector: row => row.products.length},
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
        { selector: row => row.description },
    ];

    const confirmDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            router.delete(deleteRoute(id), {
                onSuccess: () => {
                    toast.success('Category deleted successfully.');
                },
                onError: () => {
                    toast.error('Failed to delete category.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Categories</h2>
                    <PrimaryIconLink href={route('categories.create')} icon={faAdd}>Add Category</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Categories" />
            <div className='mx-auto max-w-[90%] py-6'>
                <CustomDataTable
                    title="Categories"
                    data={categories.data}
                    columns={columns}
                    filterCriteria={filterCriteria}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
