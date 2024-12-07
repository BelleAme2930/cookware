import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import IconButton from "@/Components/IconButton.jsx";
import {router} from "@inertiajs/core";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";

const SupplierLedger = ({ suppliers_ledgers }) => {

    const viewRoute = (id) => route('supplier.ledger.show', id);

    const columns = [
        { name: 'Supplier Name', selector: row => row.supplier_name },
        { name: 'Purchase Date', selector: row => row.purchase_date },
        { name: 'Total Price', selector: row => `${row.total_price} Rs` },
        { name: 'Paid Amount', selector: row => `${row.paid_amount} Rs` },
        { name: 'Remaining Balance', selector: row => `${row.remaining_balance} Rs` },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <IconButton onClick={() => router.visit(viewRoute(row.id))} icon={faEdit} />
                </div>
            )
        },
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
