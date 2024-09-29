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
        $data =  [
            'id' => $this->id,
            'weight' => $this->product->product_type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toKilos($this->weight) : null,
            'quantity' => $this->product->product_type === ProductTypeEnum::ITEM->value ? $this->quantity : null,
            'total_price' => $this->total_price,
            'created_at' => $this->created_at->format('Y-m-d'),
            'updated_at' => $this->updated_at->format('Y-m-d'),
        ];

        if ($this->relationLoaded('customer')) {
            $data['customer'] = new CustomerResource($this->customer);
        }

        if ($this->relationLoaded('product')) {
            $data['product'] = new ProductResource($this->product);
        }

        return $data;
    }
}
