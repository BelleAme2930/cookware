<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductPurchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_id',
        'product_id',
        'product_size_id',
        'quantity',
        'weight',
        'purchase_price',
        'separate_weight',
        'batch_id',
    ];

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function productSize(): BelongsTo
    {
        return $this->belongsTo(ProductSize::class);
    }

}
