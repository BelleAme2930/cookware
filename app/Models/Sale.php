<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'account_id',
        'total_price',
        'amount_paid',
        'remaining_balance',
        'due_date',
        'weight',
        'quantity',
        'cheque_number',
        'cheque_date',
        'cheque_bank',
        'sale_date',
        'payment_method',
        'account_payment',
        'cheque_amount',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function productSales(): HasMany
    {
        return $this->hasMany(ProductSale::class);
    }
}
