import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@/Components/IconButton.jsx";
import { toast } from "react-toastify";
import { router } from '@inertiajs/core';

const Ledger = ({ supplier, purchases }) => {
    const showRoute = (id) => route('sales.show', id);

    const columns = [
        { name: 'Purchase Date', selector: row => row.purchase_date },
        { name: 'Total Price', selector: row => row.total_price + ' Rs'},
        { name: 'Paid Amount', selector: row => row.amount_paid + ' Rs'},
        { name: 'Remaining Balance', selector: row => row.remaining_balance + ' Rs'},
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <IconButton onClick={() => router.visit(showRoute(row.id))} icon={faEye} />
                </div>
            ),
        },
    ];

    const filterCriteria = [
        { selector: row => row.purchase_date },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-lg leading-tight text-gray-800">
                        Supplier Ledger for: {supplier.name}
                    </h2>
                </div>
            }
        >
            <Head title="Supplier Ledger" />
            <div className="mx-auto max-w-[96%] py-6">
                <CustomDataTable
                    title="Supplier Ledger"
                    data={purchases}
                    columns={columns}
                    filterCriteria={filterCriteria}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Ledger;
