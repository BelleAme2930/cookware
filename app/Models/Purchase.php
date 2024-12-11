<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Purchase extends Model
{
    protected $fillable = [
        'due_date',
        'purchase_date',
        'supplier_id',
        'cheque_number',
        'cheque_date',
        'cheque_bank',
        'cheque_amount',
        'payment_method',
        'account_id',
        'total_price',
        'amount_paid',
        'account_payment',
        'weight',
        'quantity',
        'remaining_balance',
    ];

    use HasFactory;

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function productPurchases(): HasMany
    {
        return $this->hasMany(ProductPurchase::class);
    }

}
