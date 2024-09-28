import React from 'react';
import Label from "@/Components/Label.jsx";
import { Link } from "@inertiajs/react";
import Select from 'react-select';

const InputSelect = ({ id, label, options, value, onChange, error, required, errorMsg, link, linkText }) => {
    // Format options for react-select
    const formattedOptions = options.map(option => ({
        value: option.id,
        label: option.name,
    }));

    // Handle change to get the selected value
    const handleChange = (selectedOption) => {
        onChange(selectedOption ? selectedOption.value : '');
    };

    // Custom styles for react-select
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#e4023b' : error ? '#c00031' : '#d1d5db', // Primary color on focus and red on error
            boxShadow: state.isFocused ? '0 0 0 1px #e4023b' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#e4023b' : error ? '#c00031' : '#9ca3af', // Change on hover
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#6b7280', // Default placeholder color
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999, // Ensure the menu appears above other components
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#f4b5c1' : '#ffffff', // Background color on hover
            color: '#000000', // Text color for options
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#000000', // Text color for the selected value
        }),
    };

    return (
        <div className="mb-4 w-full lg:w-1/2 px-2">
            <div className="flex items-center justify-between">
                <Label title={label} htmlFor={id} />
                {link && (
                    <div>
                        <Link className='text-primary-500' href={link}>{linkText}</Link>
                    </div>
                )}
            </div>
            <Select
                id={id}
                value={formattedOptions.find(option => option.value === value)} // Set the selected value
                onChange={handleChange}
                options={formattedOptions}
                isClearable // Allow the option to clear the selection
                required={required}
                className={`react-select ${error ? 'border-red-600' : ''}`} // Add custom styling
                classNamePrefix="react-select" // Prefix for custom styles
                styles={customStyles} // Apply custom styles
                placeholder="Select an option"
            />
            {error && <div className="text-red-600 text-sm">{errorMsg}</div>}
        </div>
    );
};

export default InputSelect;
