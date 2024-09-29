<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'type', 'total_price', 'quantity', 'weight', 'single_price'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
