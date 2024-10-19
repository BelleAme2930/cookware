import React, {useState, useEffect} from 'react';
import {Head, useForm} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import Button from "@/Components/Button.jsx";
import InputSelect from "@/Components/InputSelect.jsx";
import PageHeader from "@/Components/PageHeader.jsx";
import BorderButton from "@/Components/BorderButton.jsx";
import TextInput from "@/Components/TextInput.jsx";
import IconButton from "@/Components/IconButton.jsx";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import Label from "@/Components/Label.jsx";

const Create = ({suppliers, products, accounts}) => {
    const {data, setData, post, processing, reset, errors} = useForm({
        supplier_id: '',
        products: [],
        due_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        account_id: '',
        amount_paid: 0,
    });

    const [productFields, setProductFields] = useState([{
        product_id: '',
        product_type: '',
        sizes: {},
        selectedSizes: {},
        weight: 0,
    }]);

    const [totalPurchasePrice, setTotalPurchasePrice] = useState(0);
    const [remainingCredit, setRemainingCredit] = useState(0);

    const supplierOptions = suppliers.map(supplier => ({
        value: supplier.id,
        label: supplier.name,
    }));

    const handleAccountSubmit = (e) => {
        e.preventDefault();
        post(route('accounts.store'), {
            onSuccess: () => {
                toast.success('Account added successfully');
                reset();
                handleCloseModal();
            },
            onError: () => {
                toast.error('Failed to add account');
            },
        });
    };

    const getProductOptions = (selectedProducts, supplier_id) => {
        return products
            .filter(product => product.supplier_id === supplier_id)
            .filter(product => !selectedProducts.includes(product.id))
            .map(product => ({
                value: product.id,
                label: product.name,
                product_type: product.product_type,
            }));
    };

    const handleAddProduct = () => {
        setProductFields([...productFields, {product_id: '', product_type: '', sizes: {}, selectedSizes: {}, weight: 0}]);
    };

    const handleRemoveProduct = (index) => {
        const updatedFields = [...productFields];
        updatedFields.splice(index, 1);
        setProductFields(updatedFields);
        setData('products', updatedFields);
        calculateTotalPurchasePrice(updatedFields);
    };

    const handleProductChange = (index, field, value) => {
        const updatedFields = [...productFields];

        if (!updatedFields[index].sizes) {
            updatedFields[index].sizes = {};
        }

        if (field === 'sizes') {
            updatedFields[index].sizes = value;
        } else {
            updatedFields[index][field] = value;

            if (field === 'product_id') {
                const selectedProduct = products.find(product => product.id === value);
                updatedFields[index]['product_type'] = selectedProduct ? selectedProduct.product_type : '';
                updatedFields[index].sizes = selectedProduct.sizes
                    ? selectedProduct.sizes.reduce((acc, size) => ({
                        ...acc,
                        [size.id]: {quantity: 0, purchase_price: 0}
                    }), {})
                    : {};
                updatedFields[index].weight = 0; // Reset weight when a new product is selected
            }
        }

        calculateTotalPurchasePrice(updatedFields);
        setProductFields(updatedFields);
        setData('products', updatedFields);
    };

    const handleSizeCheckboxChange = (index, sizeId, checked) => {
        const updatedFields = [...productFields];
        updatedFields[index].selectedSizes = {
            ...updatedFields[index].selectedSizes,
            [sizeId]: checked
        };
        setProductFields(updatedFields);
    };

    const calculateTotalPurchasePrice = (fields) => {
        let total = 0;
        fields.forEach(product => {
            if (product.sizes) {
                Object.values(product.sizes).forEach(sizeData => {
                    const quantity = parseInt(sizeData.quantity) || 0;
                    const purchasePrice = parseFloat(sizeData.purchase_price) || 0;
                    total += quantity * purchasePrice;
                });
            }

            // Include weight-based products in total purchase price calculation
            if (product.product_type === 'weight' && product.weight) {
                total += parseFloat(product.weight) * parseFloat(product.purchase_price || 0);
            }
        });
        setTotalPurchasePrice(total);
        calculateRemainingCredit(data.amount_paid, total);
    };


    const calculateRemainingCredit = (amountPaid, total) => {
        setRemainingCredit(total - amountPaid);
    };

    useEffect(() => {
        calculateRemainingCredit(data.amount_paid, totalPurchasePrice);
    }, [data.amount_paid, totalPurchasePrice]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('purchases.store'));
    };

    const accountOptions = accounts.map(acc => ({
        value: acc.id,
        label: `${acc.title} - ${acc.bank_name}`,
    }));


    return (
        <AuthenticatedLayout header={<PageHeader title='Add New Purchase'/>}>
            <Head title="Add Purchase"/>
            <div className="max-w-[96%] mx-auto p-4 border border-gray-300 mt-6 bg-white">

                <form onSubmit={handleSubmit}>
                    <InputSelect
                        id="supplier_id"
                        label="Supplier"
                        options={supplierOptions}
                        value={data.supplier_id}
                        onChange={(selected) => setData('supplier_id', selected.value)}
                        link={!suppliers.length ? route('suppliers.create') : null}
                        linkText="Add supplier?"
                        required
                    />

                    {productFields.map((product, index) => {
                        const selectedProductIds = productFields
                            .filter((_, i) => i !== index)
                            .map(field => field.product_id);

                        const filteredProductOptions = getProductOptions(selectedProductIds, data.supplier_id);

                        const selectedProduct = products.find(p => p.id === product.product_id);

                        return (
                            <div key={index}
                                 className={`mb-4 py-5 px-4 border border-gray-300 rounded-md relative !bg-gray-50`}>
                                <InputSelect
                                    id={`product_id_${index}`}
                                    label={`Product ${index + 1}`}
                                    options={filteredProductOptions}
                                    value={product.product_id}
                                    onChange={(selected) => handleProductChange(index, 'product_id', selected.value)}
                                    link={!products.length ? route('products.create') : null}
                                    linkText="Add product?"
                                    required
                                />

                                {selectedProduct && selectedProduct.sizes && (
                                    <>
                                        <Label title='Select Sizes'/>
                                        <div className='flex flex-wrap bg-white border border-gray-200 p-4 mb-4 rounded-md'>
                                            {selectedProduct.sizes.map(size => (
                                                <div key={size.id} className="mb-2 pr-2 flex items-center border px-4 mr-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`size_checkbox_${size.id}`}
                                                        checked={!!product.selectedSizes[size.id]}
                                                        onChange={(e) =>
                                                            handleSizeCheckboxChange(index, size.id, e.target.checked)
                                                        }
                                                    />
                                                    <Label htmlFor={`size_checkbox_${size.id}`} title={`Size: ${size.size}`} className='ml-2 mt-1'/>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div className='flex flex-wrap'>
                                    {selectedProduct && selectedProduct.sizes && Object.entries(product.selectedSizes).map(([sizeId, isSelected]) => {
                                        if (!isSelected) return null;
                                        const size = selectedProduct.sizes.find(s => s.id === parseInt(sizeId));
                                        return (
                                            <div key={size.id} className="mb-4 w-1/2 pr-2">
                                                <Label title={`Size: ${size.size}`} className='mb-2 text-md'/>
                                                <div className='size-box bg-white border border-gray-300 bg-gray-50 p-4'>
                                                    <div className='mb-2'>
                                                        <Label title="Quantity"/>
                                                        <TextInput
                                                            type="number"
                                                            value={product.sizes[size.id]?.quantity || 0}
                                                            onChange={(e) => {
                                                                const updatedSizes = {
                                                                    ...product.sizes,
                                                                    [size.id]: {
                                                                        ...product.sizes[size.id],
                                                                        quantity: parseInt(e.target.value)
                                                                    }
                                                                };
                                                                handleProductChange(index, 'sizes', updatedSizes);
                                                            }}
                                                            placeholder="Enter quantity"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label title="Purchase Price"/>
                                                        <TextInput
                                                            type="number"
                                                            value={product.sizes[size.id]?.purchase_price || 0}
                                                            onChange={(e) => {
                                                                const updatedSizes = {
                                                                    ...product.sizes,
                                                                    [size.id]: {
                                                                        ...product.sizes[size.id],
                                                                        purchase_price: parseFloat(e.target.value)
                                                                    }
                                                                };
                                                                handleProductChange(index, 'sizes', updatedSizes);
                                                            }}
                                                            placeholder="Enter purchase price"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {product.product_type === 'weight' && (
                                    <>
                                        <Label title={`Total Weight for ${selectedProduct?.name || ''}`}
                                               htmlFor={'weight_' + index}
                                               suffix={selectedProduct ? `Available Stock: ${selectedProduct.weight} KG` : ''}/>
                                        <TextInput
                                            id={'weight_' + index}
                                            label="Weight"
                                            type="number"
                                            value={product.weight || ''}
                                            onChange={(e) => handleProductChange(index, 'weight', parseFloat(e.target.value))}
                                            placeholder="Enter total weight"
                                            required
                                        />
                                    </>
                                )}

                                {index > 0 && (
                                    <IconButton
                                        icon={faTrash}
                                        type="button"
                                        onClick={() => handleRemoveProduct(index)}
                                        className="absolute top-2 right-2 text-red-500"
                                    />
                                )}
                            </div>
                        );
                    })}

                    <div className='flex justify-center items-center mb-5'>
                        <BorderButton type="button" disabled={processing} onClick={handleAddProduct}>
                            Add Product
                        </BorderButton>
                    </div>

                    <div className='flex justify-end items-center mb-5'>
                        <h1 className='text-xl font-semibold'>Total Purchase Price: {totalPurchasePrice}</h1>
                    </div>

                    <InputSelect
                        id="payment_method"
                        label={'Payment Method'}
                        options={[
                            {value: 'cash', label: 'Cash'},
                            {value: 'account', label: 'Account'},
                            {value: 'credit', label: 'Credit'},
                            {value: 'cheque', label: 'Cheque'},
                            {value: 'cash_account', label: 'Cash + Account'},
                            {value: 'cash_credit', label: 'Cash + Credit'},
                            {value: 'cash_cheque', label: 'Cash + Cheque'},
                            {value: 'account_cheque', label: 'Account + Cheque'},
                            {value: 'account_credit', label: 'Account + Credit'},
                            {value: 'cash_account_credit', label: 'Cash + Account + Credit'},
                            {value: 'cash_cheque_credit', label: 'Cash + Cheque + Credit'},
                            {value: 'cash_cheque_account', label: 'Cash + Cheque + Account'},
                        ]}
                        onChange={(option) => setData('payment_method', option.value)}
                        value={data.payment_method}
                        required
                    />

                    {(data.payment_method === 'account' ||
                        data.payment_method === 'cash_account' ||
                        data.payment_method === 'account_cheque' ||
                        data.payment_method === 'account_credit' ||
                        data.payment_method === 'cash_account_credit' ||
                        data.payment_method === 'cash_cheque_account') && (
                        <>
                            <div className='flex items-center justify-between'>
                                <Label title="Select Account" required/>
                                {/*<div>*/}
                                {/*    <a*/}
                                {/*        href="#"*/}
                                {/*        onClick={(e) => {*/}
                                {/*            e.preventDefault();*/}
                                {/*            handleAddAccountClick();*/}
                                {/*        }}*/}
                                {/*        className="text-red-500"*/}
                                {/*    >*/}
                                {/*        Add Account?*/}
                                {/*    </a>*/}
                                {/*</div>*/}
                            </div>
                            <InputSelect
                                id="account_id"
                                options={accountOptions}
                                value={data.account_id}
                                onChange={(selected) => setData('account_id', selected.value)}
                                required={
                                    data.payment_method === 'account' ||
                                    data.payment_method === 'cash_account' ||
                                    data.payment_method === 'account_cheque' ||
                                    data.payment_method === 'account_credit' ||
                                    data.payment_method === 'cash_account_credit' ||
                                    data.payment_method === 'cash_cheque_account'
                                }
                            />
                        </>
                    )}

                    {/* Cheque Number Field */}
                    {(data.payment_method === 'cheque' ||
                        data.payment_method === 'cash_cheque' ||
                        data.payment_method === 'account_cheque' ||
                        data.payment_method === 'cash_cheque_account') && (
                        <div className="mb-4">
                            <Label htmlFor="cheque_number" title="Cheque Number"/>
                            <TextInput
                                id="cheque_number"
                                type="text"
                                value={data.cheque_number}
                                onChange={(e) => setData('cheque_number', e.target.value)}
                                required={
                                    data.payment_method === 'cheque' ||
                                    data.payment_method === 'cash_cheque' ||
                                    data.payment_method === 'account_cheque' ||
                                    data.payment_method === 'cash_cheque_account'
                                }
                            />
                        </div>
                    )}

                    {/* Amount Paid Field */}
                    {(data.payment_method === 'cash_credit' ||
                        data.payment_method === 'account_credit' ||
                        data.payment_method === 'account_cheque' ||
                        data.payment_method === 'cash_account_credit' ||
                        data.payment_method === 'cash_cheque_account') && (
                        <div className="mb-4">
                            <Label htmlFor="amount_paid" title="Amount Paid" suffix={remainingCredit}/>
                            <TextInput
                                id="amount_paid"
                                type="number"
                                value={data.amount_paid}
                                onChange={(e) => setData('amount_paid', parseFloat(e.target.value))}
                                required={
                                    data.payment_method === 'cash_credit' ||
                                    data.payment_method === 'account_credit' ||
                                    data.payment_method === 'account_cheque' ||
                                    data.payment_method === 'cash_account_credit' ||
                                    data.payment_method === 'cash_cheque_account'
                                }
                            />
                        </div>
                    )}

                    {/* Due Date Field */}
                    {(data.payment_method === 'credit' ||
                        data.payment_method === 'cash_credit' ||
                        data.payment_method === 'cash_cheque' ||
                        data.payment_method === 'account_cheque' ||
                        data.payment_method === 'account_credit' ||
                        data.payment_method === 'cash_account_credit' ||
                        data.payment_method === 'cash_cheque_account') && (
                        <div className="mb-4">
                            <Label htmlFor="due_date" title="Due Date for Remaining Balance"/>
                            <TextInput
                                id="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                required={
                                    data.payment_method === 'credit' ||
                                    data.payment_method === 'cash_credit' ||
                                    data.payment_method === 'cash_cheque' ||
                                    data.payment_method === 'account_cheque' ||
                                    data.payment_method === 'account_credit' ||
                                    data.payment_method === 'cash_account_credit' ||
                                    data.payment_method === 'cash_cheque_account'
                                }
                            />
                        </div>
                    )}

                    <div className="flex justify-end items-center">
                        <Button type="submit" disabled={processing}>
                            {processing ? "Adding..." : "Add Purchase"}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
