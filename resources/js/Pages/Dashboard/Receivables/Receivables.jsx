import React from 'react';
import CustomDataTable from '@/Components/CustomDataTable';

const Receivables = ({ receivables }) => {
    console.log(receivables)
    const columns = [
        { name: 'Invoice Number', selector: row => row.id },
        { name: 'Customer', selector: row => row.customer.name },
        { name: 'Total Amount', selector: row => row.total_price },
        { name: 'Remaining Balance', selector: row => row.remaining_balance },
        { name: 'Due Date', selector: row => row.due_date },
        { name: 'Payment Method', selector: row => row.payment_method },
    ];

    const filterCriteria = [
        { selector: row => row.customer.name },
    ];

    return (
        <CustomDataTable
            title="Today's Receivables"
            data={receivables}
            columns={columns}
            filterCriteria={filterCriteria}
        />
    );
};

export default Receivables;
