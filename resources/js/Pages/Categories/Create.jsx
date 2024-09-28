import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import {toast} from "react-toastify";
import TextArea from "@/Components/Textarea.jsx";

const Create = () => {
    const { data, setData, post, errors, processing, reset } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('categories.store'), {
            onSuccess: () => {
                toast.success('Category added successfully');
                reset();
            },
            onError: () => {
                toast.error('Failed to add category');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Add New Category</h2>
                </div>
            }
        >
            <Head title="Categories" />
            <div className="max-w-[800px] mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label title='Category Name' required={true} htmlFor='name' />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`w-full ${errors.name ? 'border-red-600' : ''}`}
                        />
                        {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                    </div>
                    <div className="mb-4">
                        <Label title='Description' htmlFor='description'/>
                        <TextArea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className={`w-full ${errors.description ? 'border-red-600' : ''}`}
                            rows={4}
                        />
                        {errors.description && <div className="text-red-600 text-sm">{errors.description}</div>}
                    </div>
                    <Button type="submit" disabled={processing}>
                        Add Category
                    </Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};


export default Create;
