<?php

namespace App\Http\Resources;

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
            'name' => $this->name,
            'weight' => WeightHelper::toKilos($this->weight),
            'image' => $this->image,
            'stock' => $this->stock,
            'created_at' => $this->created_at->format('Y-m-d'),
            'updated_at' => $this->updated_at->format('Y-m-d'),
        ];

        if ($this->relationLoaded('category')) {
            $data['category'] = CategoryResource::make($this->category);
        }

        if ($this->relationLoaded('supplier')) {
            $data['supplier'] = CategoryResource::make($this->supplier);
        }

        return $data;
    }
}
