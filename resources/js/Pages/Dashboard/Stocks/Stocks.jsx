import React from 'react';
import CustomDataTable from '@/Components/CustomDataTable';
import IconButton from '@/Components/IconButton';
import {faEye} from "@fortawesome/free-solid-svg-icons";
import {router} from '@inertiajs/core';

const Stocks = ({categories}) => {
    console.log(categories)

    const showProductsRoute = (id) => route('categories.show', id);

    const columns = [
        {name: 'Name', selector: row => row.name},
        {name: 'Description', selector: row => row.description},
        {name: 'Category Stock', selector: row => row.products.length},
        {
            name: 'Total Weight',
            selector: row => row.total_weight ? row.total_weight : '-'
        },
        {
            name: 'Total Quantity',
            selector: row => row.total_quantity ? row.total_quantity : '-'
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <IconButton onClick={() => router.visit(showProductsRoute(row.id))} icon={faEye}/>
                </div>
            )
        },
    ];

    return (
        <CustomDataTable
            title="Stocks"
            data={categories}
            columns={columns}
            filterCriteria={[{selector: row => row.name}]}
        />
    );
};

export default Stocks;
