<?php

namespace App\Http\Resources;

use App\Enums\ProductTypeEnum;
use App\Helpers\WeightHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
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
            'supplier_id' => $this->supplier_id,
            'total_price' => $this->total_price,
            'credit_amount' => $this->credit_amount,
            'remaining_balance' => $this->remaining_balance,
            'payment_method' => $this->formatPaymentMethod($this->payment_method),
            'exact_payment_method' => $this->payment_method,
            'total_weight' => WeightHelper::toKilos($this->products->sum('pivot.weight')),
            'total_quantity' => $this->products->sum('pivot.quantity'),
            'account_id' => $this->account_id,
            'due_date' => $this->due_date,
            'purchase_date' => $this->purchase_date,
        ];

        if ($this->relationLoaded('supplier')) {
            $data['supplier'] = SupplierResource::make($this->supplier)->resolve();
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
                        'purchase_price' => $product->pivot->purchase_price,
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
