<?php

namespace App\Http\Controllers;

use App\Models\Supplier;

class SupplierLedgerController extends Controller
{
    public function index()
    {
        $suppliersLedgers = Supplier::with('purchases')
            ->get()
            ->map(function ($supplier) {
                $cumulativeBalance = 0;

                $ledger = $supplier->purchases->map(function ($purchase) use (&$cumulativeBalance) {
                    $paidAmount = $purchase->amount_paid + $purchase->account_payment + $purchase->cheque_amount;
                    $purchaseRemainingBalance = $purchase->total_price - $paidAmount;

                    $cumulativeBalance += $purchaseRemainingBalance;

                    return [
                        'purchase_date' => $purchase->purchase_date,
                        'total_price' => $purchase->total_price,
                        'paid_amount' => $paidAmount,
                        'remaining_balance' => $cumulativeBalance,
                    ];
                });

                return [
                    'id' => $supplier->id, // Include supplier ID
                    'supplier_name' => $supplier->name,
                    'ledger' => $ledger,
                ];
            });

        return inertia('Suppliers/Ledger', [
            'suppliers_ledgers' => $suppliersLedgers,
        ]);
    }


    public function show($id)
    {
        $supplier = Supplier::with('purchases')->findOrFail($id);

        // Start with the supplier's existing balance
        $cumulativeBalance = $supplier->existing_balance;

        $ledger = $supplier->purchases->map(function ($purchase) use (&$cumulativeBalance) {
            $paidAmount = $purchase->amount_paid + $purchase->account_payment + $purchase->cheque_amount;
            $purchaseRemainingBalance = $purchase->total_price - $paidAmount;

            // Add the purchase's remaining balance to the cumulative balance
            $cumulativeBalance += $purchaseRemainingBalance;

            return [
                'purchase_date' => $purchase->purchase_date,
                'total_price' => $purchase->total_price,
                'paid_amount' => $paidAmount,
                'remaining_balance' => $cumulativeBalance,
            ];
        });

        return inertia('Suppliers/ShowLedger', [
            'supplier_name' => $supplier->name,
            'existing_balance' => $supplier->existing_balance, // Pass existing balance
            'ledger' => $ledger,
        ]);
    }


}
