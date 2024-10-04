<?php

namespace App\Http\Resources;

use App\Helpers\WeightHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'total_weight' => WeightHelper::toKilos($this->products->sum('weight')),
            'total_quantity' => $this->products->sum('quantity'),
            'created_at' => $this->created_at->format('Y-m-d'),
            'updated_at' => $this->updated_at->format('Y-m-d'),
        ];

        if ($this->relationLoaded('products')) {
            $data['products'] = ProductResource::collection($this->products)->resolve();
        }

        return $data;
    }
}
