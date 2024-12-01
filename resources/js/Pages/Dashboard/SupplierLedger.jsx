import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";

const SupplierLedger = ({ suppliers_ledgers }) => {
    const columns = [
        { name: 'Supplier Name', selector: row => row.supplier_name },
        { name: 'Purchase Date', selector: row => row.purchase_date },
        { name: 'Total Price', selector: row => `${row.total_price} Rs` },
        { name: 'Paid Amount', selector: row => `${row.paid_amount} Rs` },
        { name: 'Remaining Balance', selector: row => `${row.remaining_balance} Rs` }
    ];

    const filterCriteria = [
        { selector: row => row.supplier_name },
        { selector: row => row.purchase_date }
    ];

    return (
        <div className="w-full">
            <CustomDataTable
                title="Suppliers Ledger"
                data={suppliers_ledgers}
                columns={columns}
                filterCriteria={filterCriteria}
            />
        </div>
    );
};

export default SupplierLedger;
