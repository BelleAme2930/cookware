import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import TextInput from "@/Components/TextInput.jsx";

const CustomDataTable = ({ title, data, columns, searchLabel }) => {
    const [searchText, setSearchText] = useState('');

    const filteredData = data.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    return (
        <div>
            <div className='flex items-center justify-end mb-5'>
                <label htmlFor="search" className='mr-3'>{searchLabel}</label>
                <TextInput
                    id='search'
                    type="text"
                    placeholder={`Search ${title}...`}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className='min-w-[300px]'
                />
            </div>

            <DataTable
                title={title}
                columns={columns}
                data={filteredData}
                pagination={false}
                highlightOnHover
                selectableRows
            />
        </div>
    );
};

export default CustomDataTable;
