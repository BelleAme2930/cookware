import React from 'react';
import InputSelect from "@/Components/InputSelect.jsx";
import Label from "@/Components/Label.jsx";
import TextInput from "@/Components/TextInput.jsx";
import IconButton from "@/Components/IconButton.jsx";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const ProductRow = ({
                        index,
                        productWeight,
                        products,
                        productWeights,
                        remainingWeight,
                        handleProductChange,
                        handleWeightChange,
                        handleRemoveProduct,
                        errors,
                    }) => {

    const selectedProductIds = productWeights
        .filter((_, i) => i !== index)
        .map(pw => pw.product_id);

    const productOptions = products
        .filter(product => !selectedProductIds.includes(product.id))
        .map(product => ({
            value: product.id,
            label: product.name,
        }));

    const selectedProduct = products.find(p => p.id === productWeight.product_id);

    return (
        <div className={`mb-6 p-4 border rounded-lg shadow-sm ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} relative`}>
            {index > 0 && (
                <IconButton
                    icon={faTrash}
                    onClick={() => handleRemoveProduct(index)}
                    className="absolute top-2 -left-12 text-red-500"
                />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <InputSelect
                        id={`product_id_${index}`}
                        label="Product"
                        options={productOptions}
                        value={productWeight.product_id}
                        onChange={(selected) => handleProductChange(index, selected.value)}
                        link={!products.length ? route('products.create') : null}
                        linkText="Add product?"
                        required
                    />
                </div>
                <div>
                    <div className='flex items-center justify-between'>
                        <Label title="Weight (kg)" required={true} htmlFor={`weight_${index}`} />
                        {productWeight.product_id && (
                            <div className={`text-sm ${remainingWeight < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                Available weight: {remainingWeight || selectedProduct?.available_weight_kg || 0} kg
                            </div>
                        )}
                    </div>
                    <TextInput
                        type="number"
                        id={`weight_${index}`}
                        value={productWeight.weight}
                        onChange={(e) => handleWeightChange(index, parseFloat(e.target.value) || 0)}
                        className="w-full"
                        aria-invalid={errors.weight ? 'true' : 'false'}
                    />
                    {errors.weight && <div className="text-red-600 text-sm">{errors.weight}</div>}
                </div>
            </div>
        </div>
    );
};


export default ProductRow;
