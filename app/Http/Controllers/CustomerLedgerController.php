<?php

namespace App\Http\Controllers;

use App\Models\Customer;

class CustomerLedgerController extends Controller
{
    public function index()
    {
        $customersLedgers = Customer::with('sales')
            ->get()
            ->map(function ($customer) {
                $cumulativeBalance = 0;

                $ledger = $customer->sales->map(function ($customer) use (&$cumulativeBalance) {
                    $paidAmount = $customer->amount_paid + $customer->account_payment + $customer->cheque_amount;
                    $customerRemainingBalance = $customer->total_price - $paidAmount;

                    $cumulativeBalance += $customerRemainingBalance;

                    return [
                        'sale_date' => $customer->sale_date,
                        'total_price' => $customer->total_price,
                        'paid_amount' => $paidAmount,
                        'remaining_balance' => $cumulativeBalance,
                    ];
                });

                return [
                    'id' => $customer->id,
                    'customer_name' => $customer->name,
                    'ledger' => $ledger,
                ];
            });

        return inertia('Customers/Ledger', [
            'customers_ledgers' => $customersLedgers,
        ]);
    }


    public function show($id)
    {
        $customer = Customer::with('sales')->findOrFail($id);

        $cumulativeBalance = $customer->existing_balance;

        $ledger = $customer->sales->map(function ($customer) use (&$cumulativeBalance) {
            $paidAmount = $customer->amount_paid + $customer->account_payment + $customer->cheque_amount;
            $customerRemainingBalance = $customer->total_price - $paidAmount;

            // Add the purchase's remaining balance to the cumulative balance
            $cumulativeBalance += $customerRemainingBalance;

            return [
                'sale_date' => $customer->sale_date,
                'total_price' => $customer->total_price,
                'paid_amount' => $paidAmount,
                'remaining_balance' => $cumulativeBalance,
            ];
        });

        return inertia('Customers/ShowLedger', [
            'customer_name' => $customer->name,
            'existing_balance' => $customer->existing_balance, // Pass existing balance
            'ledger' => $ledger,
        ]);
    }


}
