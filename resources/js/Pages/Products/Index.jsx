import React from 'react';
import {Head} from '@inertiajs/react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {faAdd, faEdit, faEye, faTrash} from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import IconButton from "@/Components/IconButton.jsx";
import {toast} from "react-toastify";
import {router} from '@inertiajs/core';

const Index = ({products}) => {
    console.log(products)

    const editRoute = (id) => route('products.edit', id);
    const deleteRoute = (id) => route('products.destroy', id);
    const showRoute = (id) => route('products.show', id);

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
        },
        {
            name: 'Weight',
            selector: row => row.weight,
        },
        {
            name: 'Quantity',
            selector: row => row.quantity,
        },
        {
            name: 'Sizes',
            selector: row =>
                row.sizes && row.sizes.length > 0
                    ? row.sizes.map(size => size.size).join(', ')
                    : '-',
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <IconButton onClick={() => router.visit(showRoute(row.id))} icon={faEye}/>
                    <IconButton onClick={() => router.visit(editRoute(row.id))} icon={faEdit}/>
                    <IconButton onClick={() => confirmDelete(row.id)} icon={faTrash}/>
                </div>
            )
        },
    ];

    const filterCriteria = [
        {selector: row => row.name},
        {selector: row => row.category.name},
        {selector: row => row.supplier.name},
        {selector: row => row.product_type},
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
                    <h2 className="text-lg text-gray-800 font-medium">Products Listing</h2>
                    <PrimaryIconLink href={route('products.create')} icon={faAdd}>Add Product</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Products"/>
            <div className='mx-auto w-full max-w-[96%] py-6'>
                <CustomDataTable
                    title="Products"
                    data={products}
                    columns={columns}
                    filterCriteria={filterCriteria}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
