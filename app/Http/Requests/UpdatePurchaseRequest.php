<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePurchaseRequest extends FormRequest
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
            'supplier_id' => 'nullable|exists:suppliers,id',
            'products' => 'nullable|array',
            'products.*.product_id' => 'required_with:products|exists:products,id',
            'products.*.product_type' => 'required_with:products|string',
            'products.*.quantity' => 'nullable|integer|min:0',
            'products.*.weight' => 'nullable|numeric|min:0',
            'products.*.weight_per_item' => 'nullable|numeric|min:0',
            'products.*.purchase_price' => 'required_with:products|numeric|min:0',
            'due_date' => 'nullable|date',
            'payment_method' => 'nullable|string',
            'account_id' => 'nullable|exists:accounts,id',
            'amount_paid' => 'nullable|numeric|min:0',
        ];
    }

    /**
     * Get the validation messages for the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'supplier_id.exists' => 'The selected supplier is invalid.',
            'products.*.product_id.exists' => 'The selected product is invalid.',
            'products.required' => 'At least one product is required.',
            'amount_paid.numeric' => 'The amount paid must be a number.',
            'amount_paid.min' => 'The amount paid must be at least 0.',
        ];
    }
}
