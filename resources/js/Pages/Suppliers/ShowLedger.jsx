import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

const ShowCustomerLedger = ({ customer_name, existing_balance, ledger }) => {
    const columns = [
        { name: 'Date', selector: row => row.created_at },
        { name: 'Existing Balance', selector: row => `${row.existing_balance} Rs` },
    ];

    const filterCriteria = [
        { selector: row => row.created_at },
        { selector: row => row.existing_balance },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg leading-tight text-gray-800">
                    Customer {customer_name} Ledger
                </h2>
            }
        >
            <Head title={`${customer_name} Ledger`} />
            <div className="mx-auto max-w-[96%] py-6">
                <div className="mb-4 p-4 bg-white shadow rounded">
                    <h3 className="text-xl font-semibold text-center">Customer {customer_name} Ledger</h3>
                </div>

                {/* Ledger Data Table */}
                <CustomDataTable
                    title={`${customer_name}'s Ledger`}
                    data={ledger}
                    columns={columns}
                    filterCriteria={filterCriteria}
                    actions={<p><strong>Current Balance:</strong> {existing_balance} Rs</p>}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default ShowCustomerLedger;
