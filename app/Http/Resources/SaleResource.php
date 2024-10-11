<?php

namespace App\Http\Resources;

use App\Helpers\WeightHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'total_price' => $this->total_price,
            'amount_paid' => $this->amount_paid,
            'remaining_balance' => $this->remaining_balance,
            'payment_method' => $this->formatPaymentMethod($this->payment_method),
            'exact_payment_method' => $this->payment_method,
            'total_weight' => WeightHelper::toKilos($this->products->sum('pivot.weight')),
            'total_quantity' => $this->products->sum('pivot.quantity'),
            'account_id' => $this->account_id,
            'due_date' => $this->due_date,
            'sale_date' => $this->sale_date,
        ];

        if ($this->relationLoaded('customer')) {
            $data['customer'] = CustomerResource::make($this->customer)->resolve();
        }

        if ($this->relationLoaded('products')) {
            $data['products'] = $this->products->map(function($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'product_type' => $product->product_type,
                    'pivot' => [
                        'quantity' => $product->pivot->quantity ?? null,
                        'weight' => WeightHelper::toKilos($product->pivot->weight) ?? null,
                        'sale_price' => $product->pivot->sale_price,
                    ],
                ];
            });
        }

        return $data;
    }

    private function formatPaymentMethod(string $paymentMethod): string
    {
        return ucwords(str_replace('_', ' ', $paymentMethod));
    }
}
