<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['category_id', 'supplier_id', 'name', 'weight', 'image', 'stock'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    // Accessor to get stock in kilograms for the frontend
    public function getStockAttribute()
    {
        return $this->attributes['stock'] / 1000; // Convert stock to kilograms
    }

    // Mutator to set stock in grams from kilograms input
    public function setStockAttribute($value)
    {
        $this->attributes['stock'] = $value * 1000; // Convert input kilograms to grams
    }

    // Accessor to get weight in kilograms for frontend
    public function getWeightAttribute()
    {
        return $this->attributes['weight'] / 1000; // Convert weight to kilograms
    }

    // Mutator to store weight in grams from kilograms input
    public function setWeightAttribute($value)
    {
        $this->attributes['weight'] = $value * 1000; // Convert input kilograms to grams
    }
}
