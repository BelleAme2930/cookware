import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Index = ({ purchases }) => {
    const viewInvoiceRoute = (id) => route('purchases.invoices.show', id);
    const deleteInvoiceRoute = (id) => route('purchases.invoices.destroy', id);

    const columns = [
        {
            name: 'Invoice ID',
            selector: row => `INV-${row.id}`,
            sortable: true,
        },
        {
            name: 'Supplier',
            selector: row => row.supplier.name,
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
                    toast.success('Purchase invoice deleted successfully.');
                },
                onError: () => {
                    toast.error('Failed to delete purchase invoice.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-lg leading-tight text-gray-800">Purchase Invoices</h2>}
        >
            <Head title="Purchase Invoices" />
            <div className="mx-auto max-w-[90%] py-6">
                <CustomDataTable title="Purchase Invoices" data={purchases.data} columns={columns} />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
