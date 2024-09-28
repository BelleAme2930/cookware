<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = ['customer_id', 'sale_date', 'total_weight', 'total_price', 'payment_method', 'status'];

    // Accessor to get total weight in kilograms for the frontend
    public function getTotalWeightAttribute()
    {
        return $this->attributes['total_weight'] / 1000; // Convert total weight to kilograms
    }

    // Mutator to set total weight in grams from kilograms input
    public function setTotalWeightAttribute($value)
    {
        $this->attributes['total_weight'] = $value * 1000; // Convert input kilograms to grams
    }
}
