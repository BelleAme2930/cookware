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
            'created_at' => $this->created_at->format('Y-m-d'),
            'updated_at' => $this->updated_at->format('Y-m-d'),
        ];

        if ($this->relationLoaded('sizes')) {
            $data['sizes'] = ProductSizeResource::collection($this->sizes)->resolve();
        }

        if ($this->relationLoaded('category')) {
            $data['category'] = CategoryResource::make($this->category)->resolve();
        }

        if ($this->relationLoaded('supplier')) {
            $data['supplier'] = SupplierResource::make($this->supplier)->resolve();
        }

        return $data;
    }
}
