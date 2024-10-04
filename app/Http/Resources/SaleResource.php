<?php

namespace App\Http\Resources;

use App\Enums\ProductTypeEnum;
use App\Helpers\WeightHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'total_price' => $this->total_price,
            'due_date' => $this->due_date,
            'payment_method' => $this->payment_method,
            'sale_date' => $this->sale_date,
            'created_at' => $this->created_at->format('Y-m-d'),
            'updated_at' => $this->updated_at->format('Y-m-d'),
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
                        'quantity' => $product->product_type === ProductTypeEnum::ITEM->value ? $product->pivot->quantity : null,
                        'weight' => $product->product_type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toKilos($product->pivot->weight) : null,
                        'sale_price' => $product->pivot->sale_price,
                    ],
                ];
            });
        }

        return $data;
    }
}
