<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'supplier_id',
        'name',
        'product_type',
        'weight',
        'quantity',
        'sale_price',
        'weight_per_item',
        'image',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function sales()
    {
        return $this->belongsToMany(Sale::class, 'product_sale')
            ->withPivot('quantity', 'weight', 'total_price')
            ->withTimestamps();
    }

    public function sizes()
    {
        return $this->hasMany(ProductSize::class);
    }

}
