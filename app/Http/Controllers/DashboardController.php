<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\Purchase;
use App\Models\Sale;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Modules\ProfitCalculator;

class DashboardController extends Controller
{
    private $profitCalculator;

    public function __construct()
    {
        $this->profitCalculator = new ProfitCalculator();
    }

    public function index()
    {
        $today = Carbon::today();
        $tomorrow = Carbon::today()->addDay();
        $dateSevenDaysAgo = Carbon::now()->getDaysFromStartOfWeek();
        $dateStartOfMonth = Carbon::now()->startOfMonth();
        $dateStartOfYear = Carbon::now()->startOfYear();
        $categories = Category::with('products')->get();

        // Calculate Profits
        $dailySales = Sale::whereDate('sale_date', $today)->with('products')->get();
        $dailyProfit = $this->profitCalculator->calculateProfit($dailySales, [$today]);

        $weeklySales = Sale::whereBetween('sale_date', [$dateSevenDaysAgo, $tomorrow])->with('products')->get();
        $weeklyProfit = $this->profitCalculator->calculateProfit($weeklySales, [$dateSevenDaysAgo, $tomorrow]);

        $monthlySales = Sale::whereBetween('sale_date', [$dateStartOfMonth, $tomorrow])->with('products')->get();
        $monthlyProfit = $this->profitCalculator->calculateProfit($monthlySales, [$dateStartOfMonth, $tomorrow]);

        $yearlySales = Sale::whereBetween('sale_date', [$dateStartOfYear, $tomorrow])->with('products')->get();
        $yearlyProfit = $this->profitCalculator->calculateProfit($yearlySales, [$dateStartOfYear, $tomorrow]);

        // Calculate Sales Totals
        $dailySalesTotal = $dailySales->sum('total_price');
        $weeklySalesTotal = Sale::whereBetween('sale_date', [$dateSevenDaysAgo, $tomorrow])->with('products')->sum('total_price');
        $monthlySalesTotal = Sale::whereBetween('sale_date', [$dateStartOfMonth, $tomorrow])->with('products')->sum('total_price');
        $yearlySalesTotal = Sale::whereBetween('sale_date', [$dateStartOfYear, $tomorrow])->with('products')->sum('total_price');

        // Calculate Purchases Totals
        $dailyPurchases = Purchase::whereDate('purchase_date', $today)->sum('total_price');
        $weeklyPurchases = Purchase::whereBetween('purchase_date', [$dateSevenDaysAgo, $tomorrow])->sum('total_price');
        $monthlyPurchases = Purchase::whereBetween('purchase_date', [$dateStartOfMonth, $tomorrow])->sum('total_price');
        $yearlyPurchases = Purchase::whereBetween('purchase_date', [$dateStartOfYear, $tomorrow])->sum('total_price');

        // Calculate Sales by Payment Method
        $dailyCashSales = Sale::whereDate('sale_date', $today)->where('payment_method', 'cash')->sum('total_price');
        $dailyAccountSales = Sale::whereDate('sale_date', $today)->where('payment_method', 'account')->sum('total_price');
        $dailyCreditSales = Sale::whereDate('sale_date', $today)->where('payment_method', 'credit')->sum('total_price');

        $weeklyCashSales = Sale::whereBetween('sale_date', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $weeklyAccountSales = Sale::whereBetween('sale_date', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $weeklyCreditSales = Sale::whereBetween('sale_date', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        $monthlyCashSales = Sale::whereBetween('sale_date', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $monthlyAccountSales = Sale::whereBetween('sale_date', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $monthlyCreditSales = Sale::whereBetween('sale_date', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        $yearlyCashSales = Sale::whereBetween('sale_date', [$dateStartOfYear, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $yearlyAccountSales = Sale::whereBetween('sale_date', [$dateStartOfYear, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $yearlyCreditSales = Sale::whereBetween('sale_date', [$dateStartOfYear, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        // Calculate Purchases by Payment Method
        $dailyCashPurchases = Purchase::whereDate('purchase_date', $today)->where('payment_method', 'cash')->sum('total_price');
        $dailyAccountPurchases = Purchase::whereDate('purchase_date', $today)->where('payment_method', 'account')->sum('total_price');
        $dailyCreditPurchases = Purchase::whereDate('purchase_date', $today)->where('payment_method', 'credit')->sum('total_price');

        $weeklyCashPurchases = Purchase::whereBetween('purchase_date', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $weeklyAccountPurchases = Purchase::whereBetween('purchase_date', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $weeklyCreditPurchases = Purchase::whereBetween('purchase_date', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        $monthlyCashPurchases = Purchase::whereBetween('purchase_date', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $monthlyAccountPurchases = Purchase::whereBetween('purchase_date', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $monthlyCreditPurchases = Purchase::whereBetween('purchase_date', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        $yearlyCashPurchases = Purchase::whereBetween('purchase_date', [$dateStartOfYear, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $yearlyAccountPurchases = Purchase::whereBetween('purchase_date', [$dateStartOfYear, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $yearlyCreditPurchases = Purchase::whereBetween('purchase_date', [$dateStartOfYear, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        return Inertia::render('Dashboard/Dashboard', [
            'dailySales' => $dailySalesTotal,
            'dailyCashSales' => $dailyCashSales,
            'dailyAccountSales' => $dailyAccountSales,
            'dailyCreditSales' => $dailyCreditSales,

            'weeklySales' => $weeklySalesTotal,
            'weeklyCashSales' => $weeklyCashSales,
            'weeklyAccountSales' => $weeklyAccountSales,
            'weeklyCreditSales' => $weeklyCreditSales,

            'monthlySales' => $monthlySalesTotal,
            'monthlyCashSales' => $monthlyCashSales,
            'monthlyAccountSales' => $monthlyAccountSales,
            'monthlyCreditSales' => $monthlyCreditSales,

            'yearlySales' => $yearlySalesTotal,
            'yearlyCashSales' => $yearlyCashSales,
            'yearlyAccountSales' => $yearlyAccountSales,
            'yearlyCreditSales' => $yearlyCreditSales,

            'dailyPurchases' => $dailyPurchases,
            'dailyCashPurchases' => $dailyCashPurchases,
            'dailyAccountPurchases' => $dailyAccountPurchases,
            'dailyCreditPurchases' => $dailyCreditPurchases,

            'weeklyPurchases' => $weeklyPurchases,
            'weeklyCashPurchases' => $weeklyCashPurchases,
            'weeklyAccountPurchases' => $weeklyAccountPurchases,
            'weeklyCreditPurchases' => $weeklyCreditPurchases,

            'monthlyPurchases' => $monthlyPurchases,
            'monthlyCashPurchases' => $monthlyCashPurchases,
            'monthlyAccountPurchases' => $monthlyAccountPurchases,
            'monthlyCreditPurchases' => $monthlyCreditPurchases,

            'yearlyPurchases' => $yearlyPurchases,
            'yearlyCashPurchases' => $yearlyCashPurchases,
            'yearlyAccountPurchases' => $yearlyAccountPurchases,
            'yearlyCreditPurchases' => $yearlyCreditPurchases,

            'dailyProfit' => $dailyProfit,
            'weeklyProfit' => $weeklyProfit,
            'monthlyProfit' => $monthlyProfit,
            'yearlyProfit' => $yearlyProfit,

            'categories' => CategoryResource::collection($categories)->resolve(),
        ]);
    }
}
