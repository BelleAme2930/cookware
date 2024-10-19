<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'supplier_id' => 'required|exists:suppliers,id',
            'products' => 'required|array',
            'products.*.weight' => 'required|numeric|min:0',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.product_type' => 'required|string',
            'products.*.sizes' => 'nullable|array',
            'products.*.sizes.*.quantity' => 'required_with:products.*.sizes|integer|min:0',
            'products.*.sizes.*.purchase_price' => 'required_with:products.*.sizes|numeric|min:0',
            'due_date' => 'date',
            'payment_method' => 'required|string',
            'account_id' => 'nullable|exists:accounts,id',
            'amount_paid' => 'nullable|numeric|min:0',
        ];
    }
}
