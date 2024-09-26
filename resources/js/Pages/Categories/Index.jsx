import React from 'react';
import CustomDataTable from "@/Components/CustomDataTable.jsx";
import {Head} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

const Index = ({categories}) => {
    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Created At',
            selector: row => row.created_at,
            sortable: true,
        },
        {
            name: 'Updated At',
            selector: row => row.updated_at,
            sortable: true,
        },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="text-lg leading-tight text-gray-800">Categories</h2>}
        >
            <Head title="Categories"/>
            <div className='mx-auto max-w-[90%] py-6'>
                <CustomDataTable
                    title="Categories"
                    data={categories}
                    columns={columns}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
