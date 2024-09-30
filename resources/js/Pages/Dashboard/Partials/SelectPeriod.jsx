import React from 'react';

const SelectPeriod = ({ selectedPeriod, onChange }) => {
    return (
        <select
            value={selectedPeriod}
            onChange={onChange}
            className="pr-8 py-1 rounded border-gray-300"
        >
            <option value="daily">Today</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
        </select>
    );
};

export default SelectPeriod;
