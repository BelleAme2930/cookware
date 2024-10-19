<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSize extends Model
{
    protected $fillable = [
        'product_id',
        'size',
        'sale_price',
        'weight',
        'quantity',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
