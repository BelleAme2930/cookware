<?php

namespace App\Http\Resources;

use App\Enums\ProductTypeEnum;
use App\Helpers\WeightHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data =  [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'supplier_id' => $this->supplier_id,
            'name' => $this->name,
            'product_type' => $this->product_type,
            'weight' => WeightHelper::toKilos($this->weight ?? 0) ?? 0,
            'quantity' => $this->quantity ?? 0,
            'weight_per_item' => WeightHelper::toKilos($this->weight_per_item ?? 0) ?? 0,
//            'sale_price' => $this->sale_price,
//            'total_stock_price' => $this->product_type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toKilos($this->weight) * $this->sale_price : $this->quantity * $this->sale_price,
            'created_at' => $this->created_at->format('Y-m-d'),
            'updated_at' => $this->updated_at->format('Y-m-d'),
        ];

        if ($this->relationLoaded('sizes')) {
            $data['sizes'] = ProductSizeResource::collection($this->sizes)->resolve();
        }

        return $data;
    }
}
