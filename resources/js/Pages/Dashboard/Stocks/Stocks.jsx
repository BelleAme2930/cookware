import React from 'react';
import CustomDataTable from '@/Components/CustomDataTable';
import IconButton from '@/Components/IconButton';
import {faEye} from "@fortawesome/free-solid-svg-icons";
import {router} from '@inertiajs/core';

const Stocks = ({categories}) => {

    const showProductsRoute = (id) => route('categories.show', id);

    const columns = [
        {name: 'Name', selector: row => row.name},
        {name: 'Description', selector: row => row.description},
        {name: 'Category Stock', selector: row => row.products.length},
        {
            name: 'Total Weight',
            selector: row => {
                const totalWeight = row.products
                    .filter(product => product.product_type === 'weight')
                    .map(product => product.weight)
                    .reduce((acc, weight) => acc + weight, 0);
                return totalWeight > 0 ? `${totalWeight} KG` : '-';
            }
        },
        {
            name: 'Total Quantity',
            selector: row => {
                const totalQuantity = row.products
                    .filter(product => product.product_type === 'item')
                    .map(product => product.quantity)
                    .reduce((acc, quantity) => acc + quantity || 0, 0);
                return totalQuantity > 0 ? totalQuantity : '-';
            }
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
