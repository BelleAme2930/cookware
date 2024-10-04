import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {faAdd, faEdit, faEye, faPrint, faTrash} from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Index = ({ sales }) => {

    const editRoute = (id) => route('sales.edit', id);
    const deleteRoute = (id) => route('sales.destroy', id);
    const viewRoute = (id) => route('sales.show', id);

    const columns = [
        {
            name: 'Customer',
            selector: row => row.customer.name,
        },
        {
            name: 'Products',
            selector: row => row.products.length,
        },
        {
            name: 'Weight (kg)',
            selector: row => row.products.map(product => product.product_type === 'weight' ? product.pivot.weight : '-'),
        },
        {
            name: 'Quantity',
            selector: row => row.products.map(product => product.product_type === 'item' ? product.pivot.quantity : '-'),
        },
        {
            name: 'Total Price',
            selector: row => row.total_price,
        },
        {
            name: 'Sale Date',
            selector: row => row.sale_date,
        },
        {
            name: 'Due Date',
            selector: row => row.due_date,
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <IconButton onClick={() => router.visit(viewRoute(row.id))} icon={faEye} />
                    <IconButton onClick={() => router.visit(editRoute(row.id))} icon={faEdit} />
                    <IconButton onClick={() => confirmDelete(row.id)} icon={faTrash} />
                    <IconButton onClick={() => router.visit(route('sales.invoices.show', row.id))} icon={faPrint} />
                </div>
            )
        },
    ];

    const filterCriteria = [
        { selector: row => row.customer.name },
        { selector: row => row.total_price },
        { selector: row => row.products.map(product => product.name).join(', ') }
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
                    title="Sales"
                    data={sales.data}
                    columns={columns}
                    filterCriteria={filterCriteria}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
