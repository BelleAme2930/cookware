import React from 'react';
import { Head } from '@inertiajs/react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { faAdd, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Index = ({ products }) => {
    const editRoute = (id) => route('products.edit', id);
    const deleteRoute = (id) => route('products.destroy', id);

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
            name: 'Category',
            selector: row => row.category.name,
            sortable: true,
        },
        {
            name: 'Supplier',
            selector: row => row.supplier.name,
            sortable: true,
        },
        {
            name: 'Weight (kg)',
            selector: row => (row.weight_per_unit / 1000).toFixed(2),
            sortable: true,
        },
        {
            name: 'Image',
            cell: row => <img src={`/${row.image}`} alt={row.name} className="h-20 w-20" />,
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
        if (window.confirm("Are you sure you want to delete this product?")) {
            router.delete(deleteRoute(id), {
                onSuccess: () => {
                    toast.success('Product deleted successfully.');
                },
                onError: () => {
                    toast.error('Failed to delete product.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Products</h2>
                    <PrimaryIconLink href={route('products.create')} icon={faAdd}>Add Product</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Products" />
            <div className='mx-auto max-w-[90%] py-6'>
                <CustomDataTable
                    searchLabel='Filter by Product:'
                    title="Products"
                    data={products}
                    columns={columns}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
