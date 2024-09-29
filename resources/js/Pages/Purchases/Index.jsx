import React from 'react';
import { Head } from '@inertiajs/react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {faAdd, faEdit, faPrint, faTrash} from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Index = ({ purchases }) => {

    const editRoute = (id) => route('purchases.edit', id);
    const deleteRoute = (id) => route('purchases.destroy', id);

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
        },
        {
            name: 'Product',
            selector: row => row.product.name,
        },
        {
            name: 'Quantity',
            selector: row => row.quantity ? row.quantity : '-',
        },
        {
            name: 'Weight (kg)',
            selector: row => row.weight ? row.weight : '-',
        },
        {
            name: 'Price per KG',
            selector: row => row.single_price + ' Rs',
        },
        {
            name: 'Total Price',
            selector: row => row.total_price + ' Rs',
        },
        {
            name: 'Created Date',
            selector: row => row.created_at,
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <IconButton onClick={() => router.visit(editRoute(row.id))} icon={faEdit} />
                    <IconButton onClick={() => confirmDelete(row.id)} icon={faTrash} />
                    <IconButton onClick={() => router.visit(route('purchases.invoices.show', row.id))} icon={faPrint} />
                </div>
            )
        },
    ];

    const confirmDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this purchase?")) {
            router.delete(deleteRoute(id), {
                onSuccess: () => {
                    toast.success('Purchase deleted successfully.');
                },
                onError: () => {
                    toast.error('Failed to delete purchase.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Purchases</h2>
                    <PrimaryIconLink href={route('purchases.create')} icon={faAdd}>Add Purchase</PrimaryIconLink>
                </div>
            }
        >
            <Head title="Purchases" />
            <div className='mx-auto max-w-[90%] py-6'>
                <CustomDataTable
                    title="Purchases"
                    data={purchases.data}
                    columns={columns}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
