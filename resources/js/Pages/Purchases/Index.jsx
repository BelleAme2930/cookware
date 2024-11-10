import React from 'react';
import { Head } from '@inertiajs/react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {faAdd, faEye, faPrint, faTrash} from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Index = ({ purchases }) => {

    const editRoute = (id) => route('purchases.edit', id);
    const viewRoute = (id) => route('purchases.show', id);
    const deleteRoute = (id) => route('purchases.destroy', id);

    const columns = [
        {
            name: 'Total Weight',
            selector: row => row.weight > 0 ? row.weight.toLocaleString() + ' KG' : '-',
        },
        {
            name: 'Total Quantity',
            selector: row => row.quantity.toLocaleString(),
        },
        {
            name: 'Total Price',
            selector: row => row.total_price.toLocaleString() + ' Rs',
        },
        {
            name: 'Purchase Date',
            selector: row => new Date(row.purchase_date).toLocaleDateString(),
        },
        {
            name: 'Payment Method',
            selector: row => row.payment_method.join(', '),
            class: 'capitalize'
        },
        {
            name: 'Due Date',
            selector: row => row.due_date ? new Date(row.due_date).toLocaleDateString() : '-',
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <IconButton onClick={() => router.visit(viewRoute(row.id))} icon={faEye} />
                    {/* <IconButton onClick={() => router.visit(editRoute(row.id))} icon={faEdit} /> */}
                    <IconButton onClick={() => router.visit(route('purchases.invoices.show', row.id))} icon={faPrint} />
                     <IconButton onClick={() => confirmDelete(row.id)} icon={faTrash} />
                </div>
            )
        },
    ];

    const filterCriteria = [
        { selector: row => row.supplier?.name ?? 'N/A' },
        { selector: row => row.total_price },
        { selector: row => new Date(row.purchase_date).toLocaleDateString() },
        { selector: row => row.due_date ? new Date(row.due_date).toLocaleDateString() : '-' },
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
            <div className='mx-auto max-w-[96%] py-6'>
                <CustomDataTable
                    title="Purchases"
                    data={purchases}
                    columns={columns}
                    filterCriteria={filterCriteria}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
