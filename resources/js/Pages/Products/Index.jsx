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
        },
        {
            name: 'Name',
            selector: row => row.name,
        },
        {
            name: 'Category',
            selector: row => row.category.name,
        },
        {
            name: 'Supplier',
            selector: row => row.supplier.name,
        },
        {
            name: 'Weight (kg)',
            selector: row => row.weight > 0 ? row.weight : '-',
        },
        {
            name: 'Quantity',
            selector: row => row.quantity > 0 ? row.quantity : '-',
        },
        {
            name: 'Price per KG',
            selector: row => row.price + ' Rs',
        },
        {
            name: 'Type',
            selector: row => (
                <div className="capitalize">
                    {row.product_type}
                </div>
            ),
        },
        {
            name: 'Image',
            cell: row => (
                row.image ? (
                    <img
                        src={`/${row.image}`}
                        alt={row.name}
                        className="h-20 w-20"
                    />
                ) : (
                    'No Image'
                )
            ),
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                <IconButton onClick={() => router.visit(editRoute(row.id))} icon={faEdit} />
                    <IconButton onClick={() => confirmDelete(row.id)} icon={faTrash}/>
                </div>
            )
        },
    ];

    const filterCriteria = [
        { selector: row => row.name },
        { selector: row => row.category.name },
        { selector: row => row.supplier.name },
        { selector: row => row.product_type },
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
                    title="Products"
                    data={products.data}
                    columns={columns}
                    filterCriteria={filterCriteria}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
