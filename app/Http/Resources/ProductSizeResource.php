<?php

namespace App\Http\Resources;

use App\Helpers\WeightHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductSizeResource extends JsonResource
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
            'product_id' => $this->product_id,
            'size' => $this->size,
            'sale_price' => $this->sale_price,
        ];

//        if ($this->relationLoaded('product')) {
//            $data['product'] = ProductResource::make($this->product)->resolve();
//        }

        return $data;
    }
}
