<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSaleRequest extends FormRequest
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
            'customer_id' => 'required|exists:customers,id',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.product_type' => 'required|string',
            'products.*.quantity' => 'nullable|integer|min:0',
            'products.*.weight' => 'nullable|numeric|min:0',
            'products.*.sale_price' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:cash,account,half_cash_half_account,credit,half_cash_half_credit,half_account_half_credit',
            'account_id' => 'nullable|exists:accounts,id',
            'amount_received' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date',
        ];
    }
}
