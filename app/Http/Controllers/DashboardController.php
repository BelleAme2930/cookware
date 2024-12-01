<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\Sale;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        $startOfYear = Carbon::now()->startOfYear();
        $endOfYear = Carbon::now()->endOfYear();

        $daily_purchases_sum = Purchase::whereDate('purchase_date', $today)
            ->sum('total_price');

        $daily_purchases_cash_sum = Purchase::whereDate('purchase_date', $today)
            ->whereJsonContains('payment_method', 'cash')
            ->get()
            ->sum(fn($purchase) => $purchase->total_price - ($purchase->account_payment ?? 0) - ($purchase->amount_paid ?? 0) - ($purchase->cheque_amount ?? 0));

        $daily_purchases_credit_sum = Purchase::whereDate('purchase_date', $today)
            ->whereJsonContains('payment_method', 'credit')
            ->sum('remaining_balance');

        $daily_purchases_cheque_sum = Purchase::whereDate('purchase_date', $today)
            ->whereJsonContains('payment_method', 'cheque')
            ->sum('cheque_amount');

        $daily_purchases_account_sum = Purchase::whereDate('purchase_date', $today)
            ->whereJsonContains('payment_method', 'account')->get()
            ->sum('account_payment');




        $daily_sales_sum = Sale::whereDate('sale_date', $today)
            ->sum('total_price');

        $daily_sales_cash_sum = Sale::whereDate('sale_date', $today)
            ->whereJsonContains('payment_method', 'cash')
            ->get()
            ->sum(fn($sale) => $sale->total_price - ($sale->account_payment ?? 0) - ($sale->amount_paid ?? 0) - ($sale->cheque_amount ?? 0));

        $daily_sales_credit_sum = Sale::whereDate('sale_date', $today)
            ->whereJsonContains('payment_method', 'credit')
            ->sum('remaining_balance');

        $daily_sales_cheque_sum = Sale::whereDate('sale_date', $today)
            ->whereJsonContains('payment_method', 'cheque')
            ->sum('cheque_amount');

        $daily_sales_account_sum = Sale::whereDate('sale_date', $today)
            ->whereJsonContains('payment_method', 'account')->get()
            ->sum('account_payment');


        $weekly_purchases_sum = Purchase::whereBetween('purchase_date', [$startOfWeek, $endOfWeek])
            ->sum('total_price');

        $weekly_purchases_cash_sum = Purchase::whereBetween('purchase_date', [$startOfWeek, $endOfWeek])
            ->whereJsonContains('payment_method', 'cash')
            ->get()
            ->sum(fn($purchase) => $purchase->total_price - ($purchase->account_payment ?? 0) - ($purchase->amount_paid ?? 0) - ($purchase->cheque_amount ?? 0));

        $weekly_purchases_credit_sum = Purchase::whereBetween('purchase_date', [$startOfWeek, $endOfWeek])
            ->whereJsonContains('payment_method', 'credit')
            ->sum('remaining_balance');

        $weekly_purchases_cheque_sum = Purchase::whereBetween('purchase_date', [$startOfWeek, $endOfWeek])
            ->whereJsonContains('payment_method', 'cheque')
            ->sum('cheque_amount');

        $weekly_purchases_account_sum = Purchase::whereBetween('purchase_date', [$startOfWeek, $endOfWeek])
            ->whereJsonContains('payment_method', 'account')
            ->get()
            ->sum('account_payment');

        $weekly_sales_sum = Sale::whereBetween('sale_date', [$startOfWeek, $endOfWeek])
            ->sum('total_price');

        $weekly_sales_cash_sum = Sale::whereBetween('sale_date', [$startOfWeek, $endOfWeek])
            ->whereJsonContains('payment_method', 'cash')
            ->get()
            ->sum(fn($sale) => $sale->total_price - ($sale->account_payment ?? 0) - ($sale->amount_paid ?? 0) - ($sale->cheque_amount ?? 0));

        $weekly_sales_credit_sum = Sale::whereBetween('sale_date', [$startOfWeek, $endOfWeek])
            ->whereJsonContains('payment_method', 'credit')
            ->sum('remaining_balance');

        $weekly_sales_cheque_sum = Sale::whereBetween('sale_date', [$startOfWeek, $endOfWeek])
            ->whereJsonContains('payment_method', 'cheque')
            ->sum('cheque_amount');

        $weekly_sales_account_sum = Sale::whereBetween('sale_date', [$startOfWeek, $endOfWeek])
            ->whereJsonContains('payment_method', 'account')
            ->get()
            ->sum('account_payment');


        $monthly_purchases_sum = Purchase::whereBetween('purchase_date', [$startOfMonth, $endOfMonth])
            ->sum('total_price');

        $monthly_purchases_cash_sum = Purchase::whereBetween('purchase_date', [$startOfMonth, $endOfMonth])
            ->whereJsonContains('payment_method', 'cash')
            ->get()
            ->sum(fn($purchase) => $purchase->total_price - ($purchase->account_payment ?? 0) - ($purchase->amount_paid ?? 0) - ($purchase->cheque_amount ?? 0));

        $monthly_purchases_credit_sum = Purchase::whereBetween('purchase_date', [$startOfMonth, $endOfMonth])
            ->whereJsonContains('payment_method', 'credit')
            ->sum('remaining_balance');

        $monthly_purchases_cheque_sum = Purchase::whereBetween('purchase_date', [$startOfMonth, $endOfMonth])
            ->whereJsonContains('payment_method', 'cheque')
            ->sum('cheque_amount');

        $monthly_purchases_account_sum = Purchase::whereBetween('purchase_date', [$startOfMonth, $endOfMonth])
            ->whereJsonContains('payment_method', 'account')
            ->get()
            ->sum('account_payment');

        $monthly_sales_sum = Sale::whereBetween('sale_date', [$startOfMonth, $endOfMonth])
            ->sum('total_price');

        $monthly_sales_cash_sum = Sale::whereBetween('sale_date', [$startOfMonth, $endOfMonth])
            ->whereJsonContains('payment_method', 'cash')
            ->get()
            ->sum(fn($sale) => $sale->total_price - ($sale->account_payment ?? 0) - ($sale->amount_paid ?? 0) - ($sale->cheque_amount ?? 0));

        $monthly_sales_credit_sum = Sale::whereBetween('sale_date', [$startOfMonth, $endOfMonth])
            ->whereJsonContains('payment_method', 'credit')
            ->sum('remaining_balance');

        $monthly_sales_cheque_sum = Sale::whereBetween('sale_date', [$startOfMonth, $endOfMonth])
            ->whereJsonContains('payment_method', 'cheque')
            ->sum('cheque_amount');

        $monthly_sales_account_sum = Sale::whereBetween('sale_date', [$startOfMonth, $endOfMonth])
            ->whereJsonContains('payment_method', 'account')
            ->get()
            ->sum('account_payment');

        $yearly_purchases_sum = Purchase::whereBetween('purchase_date', [$startOfYear, $endOfYear])
            ->sum('total_price');

        $yearly_purchases_cash_sum = Purchase::whereBetween('purchase_date', [$startOfYear, $endOfYear])
            ->whereJsonContains('payment_method', 'cash')
            ->get()
            ->sum(fn($purchase) => $purchase->total_price - ($purchase->account_payment ?? 0) - ($purchase->amount_paid ?? 0) - ($purchase->cheque_amount ?? 0));

        $yearly_purchases_credit_sum = Purchase::whereBetween('purchase_date', [$startOfYear, $endOfYear])
            ->whereJsonContains('payment_method', 'credit')
            ->sum('remaining_balance');

        $yearly_purchases_cheque_sum = Purchase::whereBetween('purchase_date', [$startOfYear, $endOfYear])
            ->whereJsonContains('payment_method', 'cheque')
            ->sum('cheque_amount');

        $yearly_purchases_account_sum = Purchase::whereBetween('purchase_date', [$startOfYear, $endOfYear])
            ->whereJsonContains('payment_method', 'account')
            ->get()
            ->sum('account_payment');

        $yearly_sales_sum = Sale::whereBetween('sale_date', [$startOfYear, $endOfYear])
            ->sum('total_price');

        $yearly_sales_cash_sum = Sale::whereBetween('sale_date', [$startOfYear, $endOfYear])
            ->whereJsonContains('payment_method', 'cash')
            ->get()
            ->sum(fn($sale) => $sale->total_price - ($sale->account_payment ?? 0) - ($sale->amount_paid ?? 0) - ($sale->cheque_amount ?? 0));

        $yearly_sales_credit_sum = Sale::whereBetween('sale_date', [$startOfYear, $endOfYear])
            ->whereJsonContains('payment_method', 'credit')
            ->sum('remaining_balance');

        $yearly_sales_cheque_sum = Sale::whereBetween('sale_date', [$startOfYear, $endOfYear])
            ->whereJsonContains('payment_method', 'cheque')
            ->sum('cheque_amount');

        $yearly_sales_account_sum = Sale::whereBetween('sale_date', [$startOfYear, $endOfYear])
            ->whereJsonContains('payment_method', 'account')
            ->get()
            ->sum('account_payment');

        $daily_sales = Sale::whereDate('sale_date', $today)->get();
        $daily_profit = $this->calculateProfit($daily_sales);

        $weekly_sales = Sale::whereBetween('sale_date', [$startOfWeek, $endOfWeek])->get();
        $weekly_profit = $this->calculateProfit($weekly_sales);

        $monthly_sales = Sale::whereBetween('sale_date', [$startOfMonth, $endOfMonth])->get();
        $monthly_profit = $this->calculateProfit($monthly_sales);

        $yearly_sales = Sale::whereBetween('sale_date', [$startOfYear, $endOfYear])->get();
        $yearly_profit = $this->calculateProfit($yearly_sales);


        return Inertia::render('Dashboard/Dashboard', [
            'daily_purchases_sum' => $daily_purchases_sum,
            'daily_purchases_cash_sum' => $daily_purchases_cash_sum,
            'daily_purchases_credit_sum' => $daily_purchases_credit_sum,
            'daily_purchases_cheque_sum' => $daily_purchases_cheque_sum,
            'daily_purchases_account_sum' => $daily_purchases_account_sum,

            'daily_sales_sum' => $daily_sales_sum,
            'daily_sales_cash_sum' => $daily_sales_cash_sum,
            'daily_sales_credit_sum' => $daily_sales_credit_sum,
            'daily_sales_cheque_sum' => $daily_sales_cheque_sum,
            'daily_sales_account_sum' => $daily_sales_account_sum,

            'weekly_purchases_sum' => $weekly_purchases_sum,
            'weekly_purchases_cash_sum' => $weekly_purchases_cash_sum,
            'weekly_purchases_credit_sum' => $weekly_purchases_credit_sum,
            'weekly_purchases_cheque_sum' => $weekly_purchases_cheque_sum,
            'weekly_purchases_account_sum' => $weekly_purchases_account_sum,

            'weekly_sales_sum' => $weekly_sales_sum,
            'weekly_sales_cash_sum' => $weekly_sales_cash_sum,
            'weekly_sales_credit_sum' => $weekly_sales_credit_sum,
            'weekly_sales_cheque_sum' => $weekly_sales_cheque_sum,
            'weekly_sales_account_sum' => $weekly_sales_account_sum,

            'monthly_purchases_sum' => $monthly_purchases_sum,
            'monthly_purchases_cash_sum' => $monthly_purchases_cash_sum,
            'monthly_purchases_credit_sum' => $monthly_purchases_credit_sum,
            'monthly_purchases_cheque_sum' => $monthly_purchases_cheque_sum,
            'monthly_purchases_account_sum' => $monthly_purchases_account_sum,

            'monthly_sales_sum' => $monthly_sales_sum,
            'monthly_sales_cash_sum' => $monthly_sales_cash_sum,
            'monthly_sales_credit_sum' => $monthly_sales_credit_sum,
            'monthly_sales_cheque_sum' => $monthly_sales_cheque_sum,
            'monthly_sales_account_sum' => $monthly_sales_account_sum,

            'yearly_purchases_sum' => $yearly_purchases_sum,
            'yearly_purchases_cash_sum' => $yearly_purchases_cash_sum,
            'yearly_purchases_credit_sum' => $yearly_purchases_credit_sum,
            'yearly_purchases_cheque_sum' => $yearly_purchases_cheque_sum,
            'yearly_purchases_account_sum' => $yearly_purchases_account_sum,

            'yearly_sales_sum' => $yearly_sales_sum,
            'yearly_sales_cash_sum' => $yearly_sales_cash_sum,
            'yearly_sales_credit_sum' => $yearly_sales_credit_sum,
            'yearly_sales_cheque_sum' => $yearly_sales_cheque_sum,
            'yearly_sales_account_sum' => $yearly_sales_account_sum,

            'daily_profit' => $daily_profit,
            'weekly_profit' => $weekly_profit,
            'monthly_profit' => $monthly_profit,
            'yearly_profit' => $yearly_profit,
        ]);
    }

    private function calculateProfit($sales)
    {
        $profit = 0;

        foreach ($sales as $sale) {
            foreach ($sale->productSales as $productSale) {
                if ($productSale->productSize) {
                    $productSize = $productSale->productSize;

                    $productPurchase = $productSize->productPurchases()->latest()->first();

                    if ($productPurchase) {
                        $profit += ($productSale->sale_price - $productPurchase->purchase_price) * $productSale->quantity;
                    }
                } else {
                    $product = $productSale->product;

                    $productPurchase = $product->productPurchases()->latest()->first();

                    if ($productPurchase) {
                        $profit += ($productSale->sale_price - $productPurchase->purchase_price) * $productSale->quantity;
                    }
                }
            }
        }

        return $profit;
    }

}
