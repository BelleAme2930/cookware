<?php

namespace App\Http\Controllers;

use App\Http\Resources\PurchaseResource;
use App\Http\Resources\SupplierResource;
use App\Models\Supplier;

class SupplierLedgerController extends Controller
{
    public function index(Supplier $supplier)
    {
        $cumulativeBalance = 0;
        $purchases = $supplier->purchases()
            ->orderBy('purchase_date', 'asc')
            ->whereJsonContains('payment_method', 'credit')
            ->get()
            ->map(function ($purchase) use (&$cumulativeBalance) {
                $paidAmount = $purchase->amount_paid + $purchase->account_payment + $purchase->cheque_amount;

                $purchaseRemainingBalance = $purchase->total_price - $paidAmount;

                $cumulativeBalance += $purchaseRemainingBalance;

                $purchase->remaining_balance = $cumulativeBalance;

                return $purchase;
            });

        return inertia('Suppliers/Ledger', [
            'supplier' => SupplierResource::make($supplier)->resolve(),
            'purchases' => PurchaseResource::collection($purchases)->resolve(),
        ]);
    }
}
