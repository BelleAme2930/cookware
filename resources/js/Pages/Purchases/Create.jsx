import React from "react";
import {Head, useForm} from "@inertiajs/react";
import InputSelect from "@/Components/InputSelect.jsx";
import ShadowBox from "@/Components/ShadowBox.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Label} from "@headlessui/react";
import TextInput from "@/Components/TextInput.jsx";

const PurchaseCreate = ({suppliers, products, accounts}) => {
    const {data, setData, post, processing, reset} = useForm({
        supplier_id: "",
        product_items: [{product_id: "", sizes: [], quantity: 1, weight: "", purchase_price: 1}],
        payment_method: [],
        due_date: '',
        cheque_date: '',
        cheque_number: '',
        amount_paid: '',
        account_id: '',
        account_payment: '',
        cheque_amount: '',
        cheque_bank: '',
        total_price: '',
    });

    const addProductItem = () => {
        setData("product_items", [
            ...data.product_items,
            {product_id: "", sizes: [], quantity: 1, weight: "", purchase_price: 1},
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const totalPrice = calculateTotalPrice();
        setData("total_price", totalPrice);
        post(route('purchases.store'), {
            data: {
                ...data,
                total_price: totalPrice,
            },
            onSuccess: () => reset(),
        });
    };

    const calculateTotalPrice = () => {
        return data.product_items.reduce((total, item) => {
            const selectedProduct = products.find(p => p.id === item.product_id);
            const isWeightBased = selectedProduct?.product_type === "weight";
            const hasSizes = item.sizes && item.sizes.length > 0;

            if (selectedProduct) {
                if (isWeightBased) {
                    if (hasSizes) {
                        total += item.sizes.reduce((sizeTotal, size) => {
                            const purchasePrice = parseInt(size.purchase_price) || 0;
                            const weight = parseFloat(size.weight) || 1;
                            return sizeTotal + (purchasePrice * weight);
                        }, 0);
                    } else {
                        const purchasePrice = parseInt(item.purchase_price) || 0;
                        const weight = parseFloat(item.weight) || 1;
                        total += purchasePrice * weight;
                    }
                } else {
                    if (hasSizes) {
                        total += item.sizes.reduce((sizeTotal, size) => {
                            const purchasePrice = parseInt(size.purchase_price) || 0;
                            const quantity = parseFloat(size.quantity) || 1;
                            return sizeTotal + (purchasePrice * quantity);
                        }, 0);
                    } else {
                        const purchasePrice = parseInt(item.purchase_price) || 0;
                        const quantity = parseFloat(item.quantity) || 1;
                        total += purchasePrice * quantity;
                    }
                }
            }
            return total;
        }, 0);
    };

    const hasPaymentMethod = (method) => data.payment_method.includes(method);

    return (
        <AuthenticatedLayout header={<h2 className="text-lg leading-tight text-gray-800">Add New Purchase</h2>}>
            <Head title="Add Purchase"/>
            <div className="max-w-[90%] w-full mx-auto p-4">
                <ShadowBox>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Supplier</label>
                            <InputSelect
                                options={suppliers.map(supplier => ({
                                    value: supplier.id,
                                    label: supplier.name,
                                }))}
                                value={data.supplier_id}
                                onChange={(selected) => setData("supplier_id", selected?.value || "")}
                                isClearable
                                placeholder="Select Supplier"
                            />
                        </div>

                        {data.product_items.map((item, index) => {
                            const selectedProduct = products.find(p => p.id === item.product_id);
                            const hasSizes = selectedProduct?.sizes?.length > 0;
                            const isWeightBased = selectedProduct?.product_type === "weight";

                            return (
                                <div key={index} className="space-y-4 border-b pb-4 mb-4">
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

                                    {/* Conditionally show fields if product is selected */}
                                    {item.product_id && (
                                        <>
                                            {hasSizes && (
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
                                            )}

                                            {item.sizes.map((size, sizeIndex) => {
                                                const selectedSize = selectedProduct?.sizes.find(s => s.id === size.value);
                                                return (
                                                    <div key={sizeIndex} className="space-y-2 bg-gray-100 p-6 rounded-md">
                                                        <h4 className="text-md font-semibold">Size: {selectedSize.size}</h4>

                                                        <div className='flex gap-3'>
                                                            <div className={isWeightBased ? 'w-1/3' : 'w-1/2'}>
                                                                <label
                                                                    className="block text-sm font-medium text-gray-700">Quantity</label>
                                                                <input
                                                                    type="number"
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                    value={size.quantity || 1}
                                                                    onChange={(e) => {
                                                                        const updatedSizes = [...item.sizes];
                                                                        updatedSizes[sizeIndex].quantity = e.target.value;
                                                                        handleProductChange(index, "sizes", updatedSizes);
                                                                    }}
                                                                    min="1"
                                                                    required
                                                                />
                                                            </div>

                                                            {isWeightBased && (
                                                                <div className='w-1/3'>
                                                                    <label
                                                                        className="block text-sm font-medium text-gray-700">Weight</label>
                                                                    <input
                                                                        type="number"
                                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                        value={size.weight || ""}
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
                                                            )}

                                                            <div className={isWeightBased ? 'w-1/3' : 'w-1/2'}>
                                                                <label
                                                                    className="block text-sm font-medium text-gray-700">Purchase
                                                                    Price</label>
                                                                <input
                                                                    type="number"
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                    value={size.purchase_price ?? 1}
                                                                    onChange={(e) => {
                                                                        const updatedSizes = [...item.sizes];
                                                                        updatedSizes[sizeIndex].purchase_price = e.target.value;
                                                                        handleProductChange(index, "sizes", updatedSizes);
                                                                    }}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Product without sizes */}
                                            {!hasSizes && isWeightBased && (
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
                                                            placeholder="Enter weight (e.g., kg)"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Purchase
                                                            Price</label>
                                                        <input
                                                            type="number"
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                            value={item.purchase_price}
                                                            onChange={(e) => handleProductChange(index, "purchase_price", e.target.value)}
                                                            min="0"
                                                            placeholder="Enter purchase price"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {!hasSizes && !isWeightBased && (
                                                <>
                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium text-gray-700">Quantity</label>
                                                        <input
                                                            type="number"
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                            value={item.quantity}
                                                            onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                                                            min="1"
                                                            placeholder="Enter quantity"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Purchase
                                                            Price</label>
                                                        <input
                                                            type="number"
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                            value={item.purchase_price}
                                                            onChange={(e) => handleProductChange(index, "purchase_price", e.target.value)}
                                                            min="0"
                                                            placeholder="Enter purchase price"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}

                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeProductItem(index)}
                                            className="text-sm text-red-600 hover:text-red-800"
                                        >
                                            Remove Product
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                        {/* Add Another Product Button */}
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={addProductItem}
                        >
                            Add Another Product
                        </button>

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
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={processing}
                        >
                            {processing ? "Submitting..." : "Submit Purchase"}
                        </button>
                    </form>
                </ShadowBox>
            </div>
        </AuthenticatedLayout>
    );
};

export default PurchaseCreate;
