<?php

namespace App\Http\Resources;

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
            'total_price' => $this->total_price,
            'quantity' => $this->quantity ?? null,
            'weight' => $this->weight ? WeightHelper::toKilos($this->weight) : null,
            'created_at' => $this->created_at->format('Y-m-d'),
            'updated_at' => $this->updated_at->format('Y-m-d'),
        ];

        if ($this->relationLoaded('product')) {
            $data['product'] = ProductResource::make($this->product)->resolve();
        }

        return $data;
    }
}
