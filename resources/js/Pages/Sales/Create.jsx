import React, {useEffect, useState} from "react";
import {Head, useForm} from "@inertiajs/react";
import InputSelect from "@/Components/InputSelect.jsx";
import ShadowBox from "@/Components/ShadowBox.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Label from "@/Components/Label.jsx";
import BorderButton from "@/Components/BorderButton.jsx";
import IconButton from "@/Components/IconButton.jsx";
import {faAdd, faTrash} from "@fortawesome/free-solid-svg-icons";

const SalesCreate = ({customers, products, accounts}) => {

    const {data, setData, post, processing, reset} = useForm({
        customer_id: "",
        product_items: [{product_id: "", sizes: [], quantity: 0, weight: 0, sale_price: 0, weight_type: ''}],
        payment_method: [],
        due_date: '',
        cheque_date: '',
        cheque_number: '',
        amount_paid: '',
        account_id: '',
        account_payment: '',
        cheque_amount: '',
        cheque_bank: '',
        total_price: 0,
    });

    const addProductItem = () => {
        setData("product_items", [
            ...data.product_items,
            {product_id: "", sizes: [], quantity: 0, weight: "", sale_price: 0, weight_type: ''},
        ]);
    };

    const removeProductItem = (index) => {
        setData("product_items", data.product_items.filter((_, i) => i !== index));
    };

    const handleProductChange = (index, field, value) => {
        const updatedItems = [...data.product_items];
        updatedItems[index][field] = value;
        setData("product_items", updatedItems);
        calculateTotalPrice();
    };

    const calculateTotalPrice = () => {
        return data.product_items.reduce((total, item) => {
            const selectedProduct = products.find(p => p.id === item.product_id);
            const isWeightBased = selectedProduct?.product_type === "weight";
            const hasSizes = item.sizes && item.sizes.length > 0;
            const weightType = item.weight_type;

            if (selectedProduct) {
                if (isWeightBased) {
                    if (hasSizes) {
                        if (weightType === 'total') {
                            const salePrice = parseFloat(item.sale_price) || 0;
                            const weight = parseFloat(item.weight) || 1;
                            total += salePrice * weight;
                        } else {
                            total += item.sizes.reduce((sizeTotal, size) => {
                                const salePrice = parseInt(size.sale_price) || 0;
                                const weight = parseFloat(size.weight) || 1;
                                return sizeTotal + (salePrice * weight);
                            }, 0);
                        }
                    } else {
                        const salePrice = parseFloat(item.sale_price) || 0;
                        const weight = parseFloat(item.weight) || 1;
                        total += salePrice * weight;
                    }
                } else {
                    if (hasSizes) {
                        total += item.sizes.reduce((sizeTotal, size) => {
                            const salePrice = parseFloat(size.sale_price) || 0;
                            const quantity = parseFloat(size.quantity) || 1;
                            return sizeTotal + (salePrice * quantity);
                        }, 0);
                    } else {
                        const salePrice = parseFloat(item.sale_price) || 0;
                        const quantity = parseFloat(item.quantity) || 1;
                        total += salePrice * quantity;
                    }
                }
            }
            return total;
        }, 0);
    };

    useEffect(() => {
        const total = calculateTotalPrice();
        setData("total_price", total);
    }, [data.product_items]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('sales.store'), {
            data: {
                ...data,
                amount_paid: parseFloat(data.amount_paid) || 0,
                cheque_amount: parseFloat(data.cheque_amount) || 0,
            },
            onSuccess: () => reset(),
        });
    };

    const hasPaymentMethod = (method) => data.payment_method.includes(method);

    return (
        <AuthenticatedLayout header={<h2 className="text-lg leading-tight text-gray-800">Add New Sale</h2>}>
            <Head title="Add Sale"/>
            <div className="max-w-[90%] w-full mx-auto p-4">
                <ShadowBox>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Customer</label>
                            <InputSelect
                                options={customers.map(customer => ({
                                    value: customer.id,
                                    label: customer.name,
                                }))}
                                value={data.customer_id}
                                onChange={(selected) => setData("customer_id", selected?.value || "")}
                                isClearable
                                placeholder="Select Customer"
                            />
                        </div>

                        <div>
                            {data.product_items.map((item, index) => {
                                const selectedProduct = products.find(p => p.id === item.product_id);
                                const hasSizes = selectedProduct?.sizes?.length > 0;
                                const isWeightBased = selectedProduct?.product_type === "weight";
                                const weightType = item.weight_type;

                                return (
                                    <div key={index} className="space-y-4 border-b pb-4 mb-4 bg-gray-100 p-4 relative">
                                        <div className='absolute top-2 right-2'>
                                            {index > 0 && (
                                                <IconButton icon={faTrash} onClick={() => removeProductItem(index)} type='button'/>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Product</label>
                                            <InputSelect
                                                options={products.map(product => ({
                                                    value: product.id,
                                                    label: product.name,
                                                }))}
                                                value={item.product_id}
                                                onChange={(selected) => {
                                                    handleProductChange(index, "product_id", selected?.value || "");
                                                    handleProductChange(index, "sizes", []);
                                                }}
                                                isClearable
                                                placeholder="Select Product"
                                            />
                                        </div>

                                        {selectedProduct && isWeightBased && hasSizes && (
                                            <div>
                                                <label
                                                    className="block text-sm font-medium text-gray-700">Weight Type</label>
                                                <InputSelect
                                                    options={[
                                                        {value: 'total', label: 'Total'},
                                                        {value: 'unit', label: 'Per Unit'},
                                                    ]}
                                                    value={item.sizes}
                                                    onChange={(e) => handleProductChange(index, "weight_type", e.value)}
                                                    placeholder="Select Weight Type"
                                                />
                                            </div>
                                        )}

                                        {selectedProduct && hasSizes && (
                                            <>
                                                {isWeightBased && weightType ? (
                                                    <>
                                                        {hasSizes && (
                                                            <>
                                                                <div>
                                                                    <label
                                                                        className="block text-sm font-medium text-gray-700">Sizes</label>
                                                                    <InputSelect
                                                                        options={selectedProduct.sizes.map(size => ({
                                                                            value: size.id,
                                                                            label: size.size,
                                                                        }))}
                                                                        value={item.sizes}
                                                                        onChange={(selectedSizes) => handleProductChange(index, "sizes", selectedSizes || [])}
                                                                        isMulti
                                                                        placeholder="Select Sizes"
                                                                    />
                                                                    {item.sizes && item.sizes.length > 0 && (
                                                                        <>
                                                                            {item.sizes.map((size, sizeIndex) => {
                                                                                const selectedSize = selectedProduct?.sizes.find(s => s.id === size.value);
                                                                                return (
                                                                                    <>
                                                                                        {weightType === 'unit' ? (
                                                                                            <div key={sizeIndex}
                                                                                                 className="space-y-2 bg-gray-100 p-6 rounded-md">
                                                                                                <h4 className="text-md font-semibold">Size: {selectedSize.size}</h4>

                                                                                                <div className='flex gap-3'>
                                                                                                    <div className='w-1/3'>
                                                                                                        <label
                                                                                                            className="block text-sm font-medium text-gray-700">Quantity</label>
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                                                            value={size.quantity || ''}
                                                                                                            onChange={(e) => {
                                                                                                                const updatedSizes = [...item.sizes];
                                                                                                                updatedSizes[sizeIndex].quantity = parseInt(e.target.value);
                                                                                                                handleProductChange(index, "sizes", updatedSizes);
                                                                                                            }}
                                                                                                            min="1"
                                                                                                            required
                                                                                                        />
                                                                                                    </div>

                                                                                                    <div className='w-1/3'>
                                                                                                        <label
                                                                                                            className="block text-sm font-medium text-gray-700">Weight</label>
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                                                            value={size.weight || ''}
                                                                                                            onChange={(e) => {
                                                                                                                const updatedSizes = [...item.sizes];
                                                                                                                updatedSizes[sizeIndex].weight = e.target.value;
                                                                                                                handleProductChange(index, "sizes", updatedSizes);
                                                                                                            }}
                                                                                                            min="0"
                                                                                                            placeholder="Enter weight"
                                                                                                            required
                                                                                                        />
                                                                                                    </div>

                                                                                                    <div
                                                                                                        className='w-1/3'>
                                                                                                        <label
                                                                                                            className="block text-sm font-medium text-gray-700">Sale
                                                                                                            Price</label>
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                                                            value={size.sale_price ?? ''}
                                                                                                            onChange={(e) => {
                                                                                                                const updatedSizes = [...item.sizes];
                                                                                                                updatedSizes[sizeIndex].sale_price = e.target.value;
                                                                                                                handleProductChange(index, "sizes", updatedSizes);
                                                                                                            }}
                                                                                                            required
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <>
                                                                                                <div
                                                                                                    className='w-full p-4 rounded-md bg-gray-100'>
                                                                                                    <h4 className="text-md font-semibold mb-2">Size: {selectedSize.size}</h4>
                                                                                                    <label
                                                                                                        className="block text-sm font-medium text-gray-700">Quantity</label>
                                                                                                    <input
                                                                                                        type="number"
                                                                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                                                        value={size.quantity || ''}
                                                                                                        onChange={(e) => {
                                                                                                            const updatedSizes = [...item.sizes];
                                                                                                            updatedSizes[sizeIndex].quantity = parseInt(e.target.value);
                                                                                                            handleProductChange(index, "sizes", updatedSizes);
                                                                                                        }}
                                                                                                        min="1"
                                                                                                        required
                                                                                                    />
                                                                                                </div>
                                                                                            </>
                                                                                        )}
                                                                                    </>
                                                                                );
                                                                            })}
                                                                        </>
                                                                    )}
                                                                    {weightType === 'total' && (
                                                                        <>
                                                                            <div>
                                                                                <label
                                                                                    className="block text-sm font-medium text-gray-700">Weight</label>
                                                                                <input
                                                                                    type="number"
                                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                                    value={item.weight}
                                                                                    onChange={(e) => handleProductChange(index, "weight", e.target.value)}
                                                                                    min="0"
                                                                                    placeholder="Enter weight"
                                                                                    required
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label
                                                                                    className="block text-sm font-medium text-gray-700">Sale
                                                                                    Price</label>
                                                                                <input
                                                                                    type="number"
                                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                                    value={item.sale_price}
                                                                                    onChange={(e) => handleProductChange(index, "sale_price", e.target.value)}
                                                                                    min="0"
                                                                                    placeholder="Sale Price"
                                                                                />
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {hasSizes ? (
                                                            <>
                                                                <div>
                                                                    <label
                                                                        className="block text-sm font-medium text-gray-700">Sizes</label>
                                                                    <InputSelect
                                                                        options={selectedProduct.sizes.map(size => ({
                                                                            value: size.id,
                                                                            label: size.size,
                                                                        }))}
                                                                        value={item.sizes}
                                                                        onChange={(selectedSizes) => handleProductChange(index, "sizes", selectedSizes || [])}
                                                                        isMulti
                                                                        placeholder="Select Sizes"
                                                                    />
                                                                </div>
                                                                {item.sizes && item.sizes.length > 0 && (
                                                                    <>
                                                                        {item.sizes.map((size, sizeIndex) => {
                                                                            const selectedSize = selectedProduct?.sizes.find(s => s.id === size.value);
                                                                            return (
                                                                                <div key={sizeIndex}
                                                                                     className="space-y-2 bg-gray-100 p-6 rounded-md">
                                                                                    <h4 className="text-md font-semibold">Size: {selectedSize.size}</h4>

                                                                                    <div className='flex gap-3'>
                                                                                        <div className='w-1/2'>
                                                                                            <label
                                                                                                className="block text-sm font-medium text-gray-700">Quantity</label>
                                                                                            <input
                                                                                                type="number"
                                                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                                                value={size.quantity || ''}
                                                                                                onChange={(e) => {
                                                                                                    const updatedSizes = [...item.sizes];
                                                                                                    updatedSizes[sizeIndex].quantity = parseInt(e.target.value);
                                                                                                    handleProductChange(index, "sizes", updatedSizes);
                                                                                                }}
                                                                                                min="1"
                                                                                                required
                                                                                            />
                                                                                        </div>

                                                                                        <div
                                                                                            className='w-1/2'>
                                                                                            <label
                                                                                                className="block text-sm font-medium text-gray-700">Sale
                                                                                                Price</label>
                                                                                            <input
                                                                                                type="number"
                                                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                                                value={size.sale_price ?? ''}
                                                                                                onChange={(e) => {
                                                                                                    const updatedSizes = [...item.sizes];
                                                                                                    updatedSizes[sizeIndex].sale_price = e.target.value;
                                                                                                    handleProductChange(index, "sizes", updatedSizes);
                                                                                                }}
                                                                                                required
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div>
                                                                    <label
                                                                        className="block text-sm font-medium text-gray-700">Quantity</label>
                                                                    <input
                                                                        type="number"
                                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                        value={item.quantity}
                                                                        onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                                                                        min="0"
                                                                        placeholder="Enter Quantity"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label
                                                                        className="block text-sm font-medium text-gray-700">Sale
                                                                        Price</label>
                                                                    <input
                                                                        type="number"
                                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                        value={item.sale_price}
                                                                        onChange={(e) => handleProductChange(index, "sale_price", parseInt(e.target.value))}
                                                                        min="0"
                                                                        placeholder="Sale Price"
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}

                                        {selectedProduct && !hasSizes && (
                                            <>
                                                {isWeightBased ? (
                                                    <>
                                                        <div>
                                                            <label
                                                                className="block text-sm font-medium text-gray-700">Weight</label>
                                                            <input
                                                                type="number"
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                value={item.weight}
                                                                onChange={(e) => handleProductChange(index, "weight", e.target.value)}
                                                                min="0"
                                                                placeholder="Enter weight"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                className="block text-sm font-medium text-gray-700">Quantity</label>
                                                            <input
                                                                type="number"
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                value={item.quantity}
                                                                onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                                                                min="0"
                                                                placeholder="Enter quantity"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                className="block text-sm font-medium text-gray-700">Sale
                                                                Price</label>
                                                            <input
                                                                type="number"
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                value={item.sale_price}
                                                                onChange={(e) => handleProductChange(index, "sale_price", e.target.value)}
                                                                min="0"
                                                                placeholder="Sale Price"
                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <label
                                                                className="block text-sm font-medium text-gray-700">Quantity</label>
                                                            <input
                                                                type="number"
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                value={item.quantity}
                                                                onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                                                                min="0"
                                                                placeholder="Enter quantity"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                className="block text-sm font-medium text-gray-700">Sale
                                                                Price</label>
                                                            <input
                                                                type="number"
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                value={item.sale_price}
                                                                onChange={(e) => handleProductChange(index, "sale_price", e.target.value)}
                                                                min="0"
                                                                placeholder="Sale Price"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add Another Product Button */}
                        <div className='w-full flex justify-center'>
                            <IconButton icon={faAdd} onClick={addProductItem} type="button">Add Product</IconButton>
                        </div>

                        {/* Total Price */}
                        <div className="text-right">
                            <span className="text-lg font-bold">Total Price: {calculateTotalPrice()} Rs</span>
                        </div>

                        <InputSelect
                            id="payment_method"
                            label="Payment Method"
                            options={[
                                {value: 'cash', label: 'Cash'},
                                {value: 'account', label: 'Account'},
                                {value: 'credit', label: 'Credit'},
                                {value: 'cheque', label: 'Cheque'},
                            ]}
                            isMulti
                            value={data.payment_method}
                            onChange={(options) => setData('payment_method', options.map(opt => opt.value))}
                            required
                        />

                        {hasPaymentMethod('credit') && (
                            <>
                                <div className='mt-4'>
                                    <Label title='Due Date' htmlFor='due_date'/>
                                    <TextInput
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                    />
                                </div>
                                <div className='mt-4'>
                                    <Label title='Amount Paid' htmlFor='amount_paid'/>
                                    <TextInput
                                        type="number"
                                        value={data.amount_paid}
                                        onChange={(e) => setData('amount_paid', parseInt(e.target.value))}
                                    />

                                </div>
                            </>
                        )}

                        {hasPaymentMethod('cheque') && (
                            <>
                                <div className='mt-4'>
                                    <Label title='Cheque Date' htmlFor='cheque_date'/>
                                    <TextInput
                                        type="date"
                                        label="Cheque Date"
                                        value={data.cheque_date}
                                        onChange={(e) => setData('cheque_date', e.target.value)}
                                    />
                                </div>

                                <div className='mt-4'>
                                    <Label title='Cheque Number' htmlFor='cheque_number'/>
                                    <TextInput
                                        type="text"
                                        value={data.cheque_number}
                                        onChange={(e) => setData('cheque_number', e.target.value)}
                                    />
                                </div>

                                <div className='mt-4'>
                                    <Label title='Cheque Amount' htmlFor='cheque_amount'/>
                                    <TextInput
                                        type="number"
                                        value={data.cheque_amount}
                                        onChange={(e) => setData('cheque_amount', parseInt(e.target.value))}
                                    />
                                </div>

                                <div className='mt-4'>
                                    <Label title='Bank Name' htmlFor='cheque_bank'/>
                                    <TextInput
                                        type="text"
                                        value={data.cheque_bank}
                                        onChange={(e) => setData('cheque_bank', e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        {hasPaymentMethod('account') && (
                            <>
                                <InputSelect
                                    id="account_id"
                                    label="Select Account"
                                    options={accounts.map(acc => ({
                                        value: acc.id,
                                        label: acc.title + ' - ' + acc.bank_name
                                    }))}
                                    value={data.account_id}
                                    onChange={(selected) => setData('account_id', selected ? selected.value : '')}
                                />

                                <div className='mt-4'>
                                    <Label title='Account Payment' htmlFor='account_payment'/>
                                    <TextInput
                                        id="account_payment"
                                        value={data.account_number}
                                        onChange={(e) => setData('account_payment', parseInt(e.target.value))}
                                    />
                                </div>
                            </>
                        )}

                        {/* Submit Button */}
                        <div className='w-full flex justify-center'>
                            <BorderButton type="submit" disabled={processing}>
                                {processing ? "Submitting..." : "Submit Sale"}
                            </BorderButton>
                        </div>
                    </form>
                </ShadowBox>
            </div>
        </AuthenticatedLayout>
    );
};

export default SalesCreate;
