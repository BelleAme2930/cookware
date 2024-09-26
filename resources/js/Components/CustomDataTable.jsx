import React, {useState} from 'react';
import DataTable from 'react-data-table-component';

const CustomDataTable = ({title, data, columns}) => {
    const [searchText, setSearchText] = useState('');

    const filteredData = data.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    return (
        <div>
            <div className='flex items-center justify-end'>
                <input
                type="text"
                placeholder={`Search ${title}...`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{marginBottom: '20px', padding: '8px', width: '300px'}}
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
