import React from 'react';
import Label from "@/Components/Label.jsx";
import {Link} from "@inertiajs/react";

const InputSelect = ({ id, label, options, value, onChange, error, required, errorMsg, link, linkText }) => {
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
            <select
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full border-gray-300 shadow-none focus:border-primary-500 ${error ? 'border-red-600' : ''}`}
            >
                <option value="">Select an option</option>
                {options.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                ))}
            </select>
            {error && <div className="text-red-600 text-sm">{errorMsg}</div>}
        </div>
    );
};

export default InputSelect;
