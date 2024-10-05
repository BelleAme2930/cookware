import React from 'react';
import CustomDataTable from '@/Components/CustomDataTable';

const Payables = ({ payables }) => {
    const columns = [
        { name: 'Invoice Number', selector: row => row.id },
        { name: 'Supplier', selector: row => row.supplier.name },
        { name: 'Total Amount', selector: row => row.total_price },
        { name: 'Remaining Balance', selector: row => row.remaining_balance },
        { name: 'Due Date', selector: row => row.due_date },
        { name: 'Payment Method', selector: row => row.payment_method },
    ];

    const filterCriteria = [
        { selector: row => row.supplier.name },
    ];

    return (
        <CustomDataTable
            title="Today's Payables"
            data={payables}
            columns={columns}
            filterCriteria={filterCriteria}
        />
    );
};

export default Payables;
