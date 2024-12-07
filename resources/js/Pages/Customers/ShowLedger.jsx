import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

const ShowSupplierLedger = ({ customer_name, existing_balance, ledger }) => {
    const columns = [
        { name: 'Purchase Date', selector: row => row.sale_date },
        { name: 'Total Price', selector: row => `${row.total_price} Rs` },
        { name: 'Paid Amount', selector: row => `${row.paid_amount} Rs` },
        { name: 'Remaining Balance', selector: row => `${row.remaining_balance} Rs` },
    ];

    const filterCriteria = [
        { selector: row => row.sale_date },
        { selector: row => row.total_price },
        { selector: row => row.paid_amount },
        { selector: row => row.remaining_balance },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg leading-tight text-gray-800">
                    Ledger for {customer_name}
                </h2>
            }
        >
            <Head title={`${customer_name} Ledger`} />
            <div className="mx-auto max-w-[96%] py-6">
                <div className="mb-4 p-4 bg-white shadow rounded">
                    <h3 className="text-xl font-semibold">Ledger for {customer_name}</h3>
                </div>

                {/* Ledger Data Table */}
                <CustomDataTable
                    title='Ledger'
                    data={ledger}
                    columns={columns}
                    filterCriteria={filterCriteria}
                    actions={<p><strong>Existing Balance: </strong>{existing_balance} Rs</p>}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default ShowSupplierLedger;
