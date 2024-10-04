<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = ['due_date', 'supplier_id', 'payment_method', 'account_id', 'total_price'];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_purchase')
            ->withPivot('quantity', 'weight', 'purchase_price')
            ->withTimestamps();
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
