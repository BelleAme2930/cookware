import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import TextInput from "@/Components/TextInput.jsx";
import Loader from "@/Components/Loader.jsx";

const CustomDataTable = ({ title, data, columns, searchLabel, isLoading }) => {
    const [searchText, setSearchText] = useState('');

    const filteredData = data.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const updatedColumns = columns.map(column => ({
        ...column,
        sortable: false
    }));

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f9fafb',
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#374151',
            },
        },
        rows: {
            style: {
                minHeight: '56px',
                '&:hover': {
                    backgroundColor: '#e5e7eb',
                },
            },
        },
        pagination: {
            style: {
                color: '#6b7280',
                fontSize: '13px',
                padding: '10px 0',
                display: 'flex',
                justifyContent: 'center',
            },
            pageButtonsStyle: {
                borderRadius: '5px',
                padding: '6px 12px',
                margin: '0 4px',
                color: '#111827',
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: '#e5e7eb',
                },
                '&:selected': {
                    backgroundColor: '#374151',
                    color: '#fff',
                },
            },
        },
        noData: {
            style: {
                textAlign: 'center',
                color: '#9ca3af',
            },
        },
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <div className="flex items-center space-x-3">
                    <label htmlFor="search" className="text-gray-600">{searchLabel}</label>
                    <TextInput
                        id='search'
                        type="text"
                        placeholder={`Search ${title}...`}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="min-w-[300px] border border-gray-300 rounded px-3 py-2"
                    />
                </div>
            </div>

            <div>
                <DataTable
                    className="datatable"
                    title={title}
                    columns={updatedColumns}
                    data={filteredData}
                    pagination
                    paginationPerPage={30}
                    paginationRowsPerPageOptions={[10, 30, 50, 100]}
                    highlightOnHover
                    pointerOnHover
                    progressPending={isLoading}
                    progressComponent={<Loader />}
                    customStyles={customStyles}
                    noDataComponent="No records found"
                />
            </div>
        </div>
    );
};

export default CustomDataTable;
