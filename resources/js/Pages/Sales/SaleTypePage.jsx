import React from 'react';
import { Head } from '@inertiajs/react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {faAdd, faEye, faPrint, faTrash} from "@fortawesome/free-solid-svg-icons";
import PrimaryIconLink from "@/Components/PrimaryIconLink.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const SaleTypePage = ({ sales, saleType }) => {

    const editRoute = (id) => route('sales.edit', id);
    const viewRoute = (id) => route('sales.show', id);
    const deleteRoute = (id) => route('sales.destroy', id);

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
            name: 'Sale Date',
            selector: row => new Date(row.sale_date).toLocaleDateString(),
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
                    <IconButton onClick={() => router.visit(route('sales.invoices.show', row.id))} icon={faPrint} />
                    <IconButton onClick={() => confirmDelete(row.id)} icon={faTrash} />
                </div>
            )
        },
    ];

    const filterCriteria = [
        { selector: row => row.customer.name },
        { selector: row => row.products.map(product => product.name).join(', ') },
        { selector: row => row.total_price },
        { selector: row => row.created_at },
        { selector: row => row.due_date }
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
                    <h2 className="text-lg leading-tight text-gray-800">{`${saleType} Sales`}</h2>
                    <PrimaryIconLink href={route('sales.create')} icon={faAdd}>Add Sale</PrimaryIconLink>
                </div>
            }
        >
            <Head title={`${saleType} Sales`} />
            <div className='mx-auto max-w-[96%] py-6'>
                <CustomDataTable
                    title={`${saleType} Sales`}
                    data={sales}
                    columns={columns}
                    filterCriteria={filterCriteria}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default SaleTypePage;
