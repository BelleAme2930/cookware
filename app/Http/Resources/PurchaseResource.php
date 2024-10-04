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
            'type' => $this->type,
            'single_price' => $this->single_price,
            'supplier_id' => $this->supplier_id,
            'total_price' => $this->total_price,
            'payment_method' => $this->payment_method,
            'account_id' => $this->account_id,
            'due_date' => $this->due_date,
            'quantity' => $this->quantity ?? null,
            'weight' => $this->weight ? WeightHelper::toKilos($this->weight) : null,
            'total_weight' => $this->calculateTotalWeight(),
            'created_at' => $this->created_at->format('Y-m-d'),
            'updated_at' => $this->updated_at->format('Y-m-d'),
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
                        'quantity' => $product->product_type === ProductTypeEnum::ITEM->value ? $product->pivot->quantity : null,
                        'weight' => $product->product_type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toKilos($product->pivot->weight) : null,
                        'purchase_price' => $product->pivot->purchase_price,
                    ],
                ];
            });
        }

        return $data;
    }

    protected function calculateTotalWeight(): ?float
    {
        if ($this->relationLoaded('products')) {
            return $this->products->reduce(function ($carry, $product) {
                if ($product->product_type === ProductTypeEnum::WEIGHT->value) {
                    $carry += WeightHelper::toKilos($product->pivot->weight);
                }
                return $carry;
            }, 0);
        }

        return null;
    }
}
