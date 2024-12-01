import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";

const CustomerLedger = ({ customers_ledgers }) => {
    const columns = [
        { name: 'Customer Name', selector: row => row.customer_name },
        { name: 'Sale Date', selector: row => row.sale_date },
        { name: 'Total Price', selector: row => `${row.total_price} Rs` },
        { name: 'Paid Amount', selector: row => `${row.paid_amount} Rs` },
        { name: 'Remaining Balance', selector: row => `${row.remaining_balance} Rs` }
    ];

    const filterCriteria = [
        { selector: row => row.customer_name },
        { selector: row => row.sale_date }
    ];

    return (
        <div className="mb-8 w-full">
            <CustomDataTable
                title="All Customers' Ledger"
                data={customers_ledgers}
                columns={columns}
                filterCriteria={filterCriteria}
            />
        </div>
    );
};

export default CustomerLedger;
