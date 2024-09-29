import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Index = ({ sales }) => {
    const viewInvoiceRoute = (id) => route('sales.invoices.show', id);
    const deleteInvoiceRoute = (id) => route('sales.invoices.destroy', id);

    const columns = [
        {
            name: 'Invoice ID',
            selector: row => `INV-${row.id}`,
            sortable: true,
        },
        {
            name: 'Customer',
            selector: row => row.customer.name,
            sortable: true,
        },
        {
            name: 'Total Amount',
            selector: row => row.total_price,
            sortable: true,
        },
        {
            name: 'Created Date',
            selector: row => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <IconButton onClick={() => router.visit(viewInvoiceRoute(row.id))} icon={faEye} />
                    <IconButton onClick={() => confirmDelete(row.id)} icon={faTrash} />
                </div>
            )
        },
    ];

    const confirmDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this invoice?")) {
            router.delete(deleteInvoiceRoute(id), {
                onSuccess: () => {
                    toast.success('Sale invoice deleted successfully.');
                },
                onError: () => {
                    toast.error('Failed to delete sale invoice.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-lg leading-tight text-gray-800">Sales Invoices</h2>}
        >
            <Head title="Sales Invoices" />
            <div className="mx-auto max-w-[90%] py-6">
                <CustomDataTable title="Sales Invoices" data={sales.data} columns={columns} />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
