import React from 'react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import Button from "@/Components/Button.jsx";
import { toast } from "react-toastify";
import TextArea from "@/Components/Textarea.jsx";

const Edit = ({ category }) => {
    console.log(category)
    const { data, setData, put, errors, processing } = useForm({
        name: category.name,
        description: category.description || '', // Initialize with existing description
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('categories.update', category.id), {
            onSuccess: () => {
                toast.success('Category updated successfully');
            },
            onError: () => {
                toast.error('Failed to update category');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-lg leading-tight text-gray-800">Edit Category</h2>
                </div>
            }
        >
            <Head title="Edit Category" />
            <div className="max-w-lg mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label title='Category Name' htmlFor='name' />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
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
                        Update Category
                    </Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
