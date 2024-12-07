import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

const CustomerLedger = ({ customers_ledgers }) => {
    const columns = [
        { name: 'Customer Name', selector: row => row.customer_name },
        {
            name: 'Actions',
            cell: row => (
                <a
                    href={route('customers.ledgers.show', row.id)}
                    className="text-blue-600 hover:underline"
                >
                    View Ledger
                </a>
            ),
        },
    ];

    const filterCriteria = [
        { selector: row => row.customer_name },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg leading-tight text-gray-800">All Customer Ledgers</h2>
            }
        >
            <Head title="Supplier Ledgers" />
            <div className="mx-auto max-w-[96%] py-6">
                <CustomDataTable
                    title="Supplier Ledgers"
                    data={customers_ledgers}
                    columns={columns}
                    filterCriteria={filterCriteria}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default CustomerLedger;
