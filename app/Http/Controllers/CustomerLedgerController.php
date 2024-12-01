<?php

namespace App\Http\Controllers;

use App\Http\Resources\CustomerResource;
use App\Http\Resources\SaleResource;
use App\Models\Customer;

class CustomerLedgerController extends Controller
{
    public function index(Customer $customer)
    {
        $cumulativeBalance = 0;
        $sales = $customer->sales()
            ->orderBy('sale_date', 'asc')
            ->whereJsonContains('payment_method', 'credit')
            ->get()
            ->map(function ($sale) use (&$cumulativeBalance) {
                $paidAmount = $sale->amount_paid + $sale->account_payment + $sale->cheque_amount;

                $saleRemainingBalance = $sale->total_price - $paidAmount;

                $cumulativeBalance += $saleRemainingBalance;

                $sale->remaining_balance = $cumulativeBalance;

                return $sale;
            });

        return inertia('Customers/Ledger', [
            'customer' => CustomerResource::make($customer)->resolve(),
            'sales' => SaleResource::collection($sales)->resolve(),
        ]);
    }
}
