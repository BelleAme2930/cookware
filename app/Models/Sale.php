<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = ['customer_id',
        'total_price',
        'due_date',
        'sale_date',
        'payment_method',
        'account_id',
        'semi_credit_amount',
        'remaining_balance',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_sale')
            ->withPivot('quantity', 'weight', 'sale_price')
            ->withTimestamps();
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
