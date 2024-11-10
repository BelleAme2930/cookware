<?php

namespace App\Http\Resources;

use App\Helpers\WeightHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductPurchaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'purchase_id' => $this->purchase_id,
            'product_id' => $this->product_id,
            'product_size_id' => $this->product_size_id,
            'quantity' => $this->quantity,
            'weight' => WeightHelper::toKilos($this->weight ?? 0),
            'purchase_price' => $this->purchase_price,
        ];
    }
}
