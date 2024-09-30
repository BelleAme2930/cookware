import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CustomDataTable from '@/Components/CustomDataTable';

const Show = ({ category }) => {
    console.log(category)

    const columns = [
        { name: 'Product Name', selector: row => row.name },
        { name: 'Type', selector: row => row.product_type },
        { name: 'Weight', selector: row => row.weight },
        { name: 'Quantity', selector: row => row.quantity },
        { name: 'Price', selector: row => `$${row.price}` },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{category.name} - Products</h2>}
        >
            <Head title={`${category.name} Products`} />
            <div className="mx-auto max-w-[90%] py-6">
                <CustomDataTable
                    title={`${category.name} - Products`}
                    data={category.products}
                    columns={columns}
                    filterCriteria={[{ selector: row => row.name }]}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
