import React from 'react';
import Label from "@/Components/Label.jsx";
import { Link } from "@inertiajs/react";
import Select from 'react-select';

const InputSelect = ({ id, label, options, value, onChange, error, required, errorMsg, link, linkText }) => {

    const formattedOptions = options.map(option => ({
        value: option.id,
        label: option.name,
    }));


    const handleChange = (selectedOption) => {
        onChange(selectedOption ? selectedOption.value : '');
    };


    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#e4023b' : error ? '#c00031' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 1px #e4023b' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#e4023b' : error ? '#c00031' : '#9ca3af',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#6b7280',
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#f4b5c1' : '#ffffff',
            color: '#000000',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#000000',
        }),
    };

    return (
        <div className="mb-4 w-full lg:w-1/2 px-2">
            <div className="flex items-center justify-between">
                <Label title={label} htmlFor={id} required={required} />
                {link && (
                    <div>
                        <Link className='text-primary-500' href={link}>{linkText}</Link>
                    </div>
                )}
            </div>
            <Select
                id={id}
                value={formattedOptions.find(option => option.value === value)}
                onChange={handleChange}
                options={formattedOptions}
                isClearable
                required={required}
                className={`react-select ${error ? 'border-red-600' : ''}`}
                classNamePrefix="react-select"
                styles={customStyles}
                placeholder="Select an option"
            />
            {error && <div className="text-red-600 text-sm">{errorMsg}</div>}
        </div>
    );
};

export default InputSelect;
