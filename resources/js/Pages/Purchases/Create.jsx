import React, {useEffect, useState} from 'react';
import {Head, useForm} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Button from "@/Components/Button.jsx";
import {toast} from "react-toastify";
import InputSelect from "@/Components/InputSelect.jsx";
import Label from "@/Components/Label.jsx";
import ShadowBox from "@/Components/ShadowBox.jsx";
import IconButton from "@/Components/IconButton.jsx";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

const Create = ({suppliers, products, accounts}) => {
    const {data, setData, post, errors, processing, reset} = useForm({
        supplier_id: '',
        payment_method: [],
        due_date: new Date().toISOString().split('T')[0],
        account_id: '',
        amount_paid: 0,
        account_payment: 0,
        cheque_number: '',
        products: [],
        total_price: 0,
    });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productType, setProductType] = useState('');
    const [selectedSizes, setSelectedSizes] = useState([]);

    const handleAddProduct = () => {
        if (!selectedProduct) {
            toast.error('Please select a product');
            return;
        }

        const product = products.find(prod => prod.id === selectedProduct);
        const sizesToAdd = product.sizes.filter(size => selectedSizes.includes(size.id));

        if (sizesToAdd.length === 0) {
            toast.error('Please select at least one size for the product');
            return;
        }

        const existingProductIndex = data.products.findIndex(prod => prod.product_id === selectedProduct);
        if (existingProductIndex !== -1) {
            const updatedProducts = [...data.products];
            sizesToAdd.forEach(size => {
                const existingSizeIndex = updatedProducts[existingProductIndex].sizes.findIndex(s => s.id === size.id);
                if (existingSizeIndex === -1) {
                    updatedProducts[existingProductIndex].sizes.push({
                        id: size.id,
                        size: size.size,
                        quantity: 0,
                        purchase_price: 0,
                    });
                }
            });
            setData('products', updatedProducts);
        } else {
            setData('products', [
                ...data.products,
                {
                    product_id: selectedProduct,
                    product_type: productType,
                    sizes: sizesToAdd.map(size => ({
                        id: size.id,
                        size: size.size,
                        quantity: 0,
                        purchase_price: 0,
                    })),
                    weight: 0,
                },
            ]);
        }

        setSelectedProduct(null);
        setSelectedSizes([]);
    };

    const removeProduct = (productId) => {
        const updatedProducts = data.products.filter(prod => prod.product_id !== productId);
        setData('products', updatedProducts);
    };

    const handleSizeChange = (sizeId) => {
        setSelectedSizes(prevSizes =>
            prevSizes.includes(sizeId)
                ? prevSizes.filter(id => id !== sizeId)
                : [...prevSizes, sizeId]
        );
    };

    const handleWeightChange = (productIndex, value) => {
        const updatedProducts = [...data.products];
        updatedProducts[productIndex].weight = parseFloat(value) || 0;
        setData('products', updatedProducts);
    };


    const handleQuantityChange = (productIndex, sizeIndex, value) => {
        const updatedProducts = [...data.products];
        updatedProducts[productIndex].sizes[sizeIndex].quantity = value;
        setData('products', updatedProducts);
    };

    const handlePurchasePriceChange = (productIndex, sizeIndex, value) => {
        const updatedProducts = [...data.products];
        updatedProducts[productIndex].sizes[sizeIndex].purchase_price = value;
        setData('products', updatedProducts);
    };

    const removeSize = (productIndex, sizeIndex) => {
        const updatedProducts = [...data.products];
        updatedProducts[productIndex].sizes.splice(sizeIndex, 1);

        if (updatedProducts[productIndex].sizes.length === 0) {
            removeProduct(updatedProducts[productIndex].product_id);
        } else {
            setData('products', updatedProducts);
        }
    };

    const calculateTotalPrice = () => {
        return data.products.reduce((total, product) => {
            const productTotal = product.sizes.reduce((sum, size) => {
                return sum + (size.quantity * size.purchase_price);
            }, 0);
            return total + productTotal;
        }, 0);
    };

    useEffect(() => {
        const totalPrice = calculateTotalPrice();
        setData('total_price', totalPrice);
    }, [data.products]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('purchases.store'), {
            onSuccess: () => {
                toast.success('Purchase created successfully');
                reset();
            },
            onError: () => {
                toast.error('Failed to create purchase');
                console.error(errors);
            },
        });
    };

    const getAvailableProducts = () => {
        return products.filter(product => product.supplier_id === data.supplier_id);
    };

    const paymentMethodOptions = [
        { value: 'cash', label: 'Cash' },
        { value: 'account', label: 'Account' },
        { value: 'credit', label: 'Credit' },
        { value: 'cheque', label: 'Cheque' },
    ];

    const handlePaymentMethodChange = (selectedOptions) => {
        if (selectedOptions.length <= 3) {
            setData('payment_method', selectedOptions.map(option => option.value));
        }
    };

    const handleSeparateWeightChange = (productIndex, sizeIndex, isChecked) => {
        const updatedProducts = [...data.products];
        updatedProducts[productIndex].sizes[sizeIndex].separateWeight = isChecked;
        setData('products', updatedProducts);
    };

    const handleSizeWeightChange = (productIndex, sizeIndex, value) => {
        const updatedProducts = [...data.products];
        updatedProducts[productIndex].sizes[sizeIndex].weight = parseFloat(value) || 0;
        setData('products', updatedProducts);
    };


    return (
        <AuthenticatedLayout
            header={<h2 className="text-lg leading-tight text-gray-800">Add New Purchase</h2>}
        >
            <Head title="Add Purchase"/>
            <div className="max-w-[90%] w-full mx-auto p-4">
                <ShadowBox>
                    <form onSubmit={handleSubmit}>
                        <div className='flex flex-wrap'>
                            <InputSelect
                                id="supplier_id"
                                label="Supplier"
                                options={suppliers.map(sup => ({value: sup.id, label: sup.name}))}
                                value={data.supplier_id}
                                onChange={(value) => setData('supplier_id', value.value)}
                                required
                            />

                            <div className="mt-4 w-full">
                                <InputSelect
                                    id="product_id"
                                    label="Select Product"
                                    options={getAvailableProducts().map(prod => ({value: prod.id, label: prod.name}))}
                                    value={selectedProduct}
                                    onChange={(value) => {
                                        setSelectedProduct(value.value)
                                        setProductType(products.find(prod => prod.id === value.value).product_type)
                                    }}
                                    required
                                />

                                {selectedProduct && (
                                    <div className="mb-4 w-full">
                                        <Label title="Select Sizes"/>
                                        <div className='flex'>
                                            {products.find(prod => prod.id === selectedProduct)?.sizes.map(size => (
                                                <div key={size.id}
                                                     className="flex items-center border border-gray-300 mr-2 py-2 px-3">
                                                    <input
                                                        type="checkbox"
                                                        id={`size-${size.id}`}
                                                        checked={selectedSizes.includes(size.id)}
                                                        onChange={() => handleSizeChange(size.id)}
                                                        className='p-2.5'
                                                    />
                                                    <label htmlFor={`size-${size.id}`} className='ml-3'>
                                                        {size.size}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className='flex justify-center w-full mt-3'>
                                    <Button type="button" onClick={handleAddProduct}
                                            disabled={processing || !data.supplier_id || !selectedProduct}>
                                        Add Product Sizes
                                    </Button>
                                </div>
                            </div>

                            {data.products.length > 0 && (
                                <div className="mb-4 w-full">
                                    <Label title='Selected Products & Sizes'/>
                                    <div className='flex gap-2 flex-wrap'>
                                        {data.products.map((prod, productIndex) => (
                                            <div key={productIndex}
                                                 className="flex flex-col bg-gray-100 p-4 rounded-lg border border-gray-300 mb-2 w-full">
                                                <div className='flex justify-between items-center mb-3'>
                                                    <div className="font-semibold">
                                                        {products.find((product) => product.id === prod.product_id)?.name}
                                                    </div>
                                                    <IconButton onClick={() => removeProduct(prod.product_id)}
                                                                icon={faTrash}/>
                                                </div>
                                                {prod.sizes.map((size, sizeIndex) => (
                                                    <div key={size.id} className="mb-2 bg-white p-6 border border-gray-200">
                                                        <div className='flex justify-between mb-3 items-center'>
                                                            <div className='font-semibold text-center'>Size {size.size}:</div>
                                                            <IconButton onClick={() => removeSize(productIndex, sizeIndex)} icon={faTrash} />
                                                        </div>
                                                        <div className='flex items-center gap-2 mb-4'>
                                                            <div className='w-full'>
                                                                <Label title='Quantity' />
                                                                <TextInput
                                                                    type="number"
                                                                    value={size.quantity}
                                                                    onChange={(e) => handleQuantityChange(productIndex, sizeIndex, e.target.value)}
                                                                    placeholder="Quantity"
                                                                    className="w-full"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='w-full'>
                                                                <Label title='Purchase Price Per Piece' />
                                                                <TextInput
                                                                    type="number"
                                                                    value={size.purchase_price}
                                                                    onChange={(e) => handlePurchasePriceChange(productIndex, sizeIndex, e.target.value)}
                                                                    placeholder="Purchase Price Per Piece"
                                                                    className="w-full"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Separate Weight Checkbox */}
                                                        <div className='flex items-center mb-4'>
                                                            <input
                                                                type="checkbox"
                                                                id={`separate-weight-${productIndex}-${sizeIndex}`}
                                                                checked={size.separateWeight || false}
                                                                onChange={(e) => handleSeparateWeightChange(productIndex, sizeIndex, e.target.checked)}
                                                                className='mr-2'
                                                            />
                                                            <label htmlFor={`separate-weight-${productIndex}-${sizeIndex}`} className='ml-1'>
                                                                Separate weight?
                                                            </label>
                                                        </div>

                                                        {/* Weight Input Field (only shows if 'Separate weight?' is checked) */}
                                                        {size.separateWeight && (
                                                            <div className='w-full'>
                                                                <Label title='Weight' />
                                                                <TextInput
                                                                    type="number"
                                                                    value={size.weight || ''}
                                                                    onChange={(e) => handleSizeWeightChange(productIndex, sizeIndex, e.target.value)}
                                                                    placeholder="Enter weight"
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {prod.product_type === 'weight' && (
                                                    <div className="mb-4 w-full">
                                                        <Label htmlFor={`weight-${productIndex}`} title='Weight (Excluding separate weights)' />
                                                        <TextInput
                                                            id={`weight-${productIndex}`}
                                                            type="text"
                                                            value={prod.weight}
                                                            onChange={(e) => handleWeightChange(productIndex, e.target.value)}
                                                            required
                                                        />
                                                        {errors && errors[`products.${productIndex}.weight`] && (
                                                            <div className="text-red-500 text-xs mt-1">
                                                                {errors[`products.${productIndex}.weight`]}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className='flex justify-end w-full'>
                                <div className='text-2xl font-semibold'>Total Price: {data.total_price} Rs</div>
                            </div>

                            <InputSelect
                                id="payment_method"
                                label="Payment Method"
                                options={paymentMethodOptions}
                                isMulti={true}
                                value={data.payment_method.map(value =>
                                    paymentMethodOptions.find(option => option.value === value))}
                                onChange={handlePaymentMethodChange}
                                required
                            />

                            <PaymentMethodFields
                                paymentMethods={data.payment_method}
                                setData={setData} data={data} accounts={accounts}
                            />

                            <div className='flex justify-center w-full mt-3'>
                                <Button type="submit" disabled={processing}>
                                    Create Purchase
                                </Button>
                            </div>
                        </div>
                    </form>
                </ShadowBox>
            </div>
        </AuthenticatedLayout>
    );
};

const PaymentMethodFields = ({ paymentMethods, setData, data, accounts }) => {
    return (
        <div className='w-full'>
            {paymentMethods.includes('cheque') && (
                <div className="mb-4 w-full">
                    <Label htmlFor="cheque_number" title="Cheque Number" />
                    <TextInput
                        id="cheque_number"
                        value={data.cheque_number}
                        onChange={(e) => setData('cheque_number', e.target.value)}
                        required
                    />
                </div>
            )}
            {paymentMethods.includes('credit') && (
                <div className="mb-4 w-full">
                    <Label htmlFor="due_date" title="Due Date" />
                    <TextInput
                        id="due_date"
                        type="date"
                        value={data.due_date}
                        onChange={(e) => setData('due_date', e.target.value)}
                        required
                    />
                </div>
            )}
            {paymentMethods.includes('account') && (
                <div className="mb-4 w-full">
                    <InputSelect
                        id="account_id"
                        label="Account"
                        options={accounts.map(acc => ({ value: acc.id, label: acc.title + ' - ' + acc.bank_name }))}
                        value={data.account_id}
                        onChange={(option) => setData('account_id', option.value)}
                        required
                    />
                </div>
            )}
            {(paymentMethods.includes('credit') || paymentMethods.includes('account')) && (
                <div className="mb-4 w-full">
                    <Label title="Amount Paid" />
                    <TextInput
                        type="number"
                        value={data.amount_paid}
                        onChange={(e) => setData('amount_paid', e.target.value)}
                        placeholder="Enter amount paid"
                        required
                    />
                </div>
            )}
            {paymentMethods.includes('account') && (
                <div className="mb-4 w-full">
                    <Label title="Account Payment" />
                    <TextInput
                        type="number"
                        value={data.account_payment}
                        onChange={(e) => setData('account_payment', parseInt(e.target.value))}
                        placeholder="Enter account payment"
                        required
                    />
                </div>
            )}
        </div>
    );
};

export default Create;
