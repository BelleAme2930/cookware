<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\Purchase;
use App\Models\Sale;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $tomorrow = Carbon::today()->addDay();
        $dateSevenDaysAgo = Carbon::now()->getDaysFromStartOfWeek();
        $dateStartOfMonth = Carbon::now()->startOfMonth();
        $dateStartOfYear = Carbon::now()->startOfYear();
        $categories = Category::with('products')->get();

        $dailySales = Sale::whereDate('created_at', $today)->sum('total_price');
        $dailyCashSales = Sale::whereDate('created_at', $today)->where('payment_method', 'cash')->sum('total_price');
        $dailyAccountSales = Sale::whereDate('created_at', $today)->where('payment_method', 'account')->sum('total_price');
        $dailyCreditSales = Sale::whereDate('created_at', $today)->where('payment_method', 'credit')->sum('total_price');

        $weeklySales = Sale::whereBetween('created_at', [$dateSevenDaysAgo, $tomorrow])->sum('total_price');
        $weeklyCashSales = Sale::whereBetween('created_at', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $weeklyAccountSales = Sale::whereBetween('created_at', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $weeklyCreditSales = Sale::whereBetween('created_at', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        $monthlySales = Sale::whereBetween('created_at', [$dateStartOfMonth, $tomorrow])->sum('total_price');
        $monthlyCashSales = Sale::whereBetween('created_at', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $monthlyAccountSales = Sale::whereBetween('created_at', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $monthlyCreditSales = Sale::whereBetween('created_at', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        $yearlySales = Sale::whereBetween('created_at', [$dateStartOfYear, $tomorrow])->sum('total_price');
        $yearlyCashSales = Sale::whereBetween('created_at', [$dateStartOfYear, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $yearlyAccountSales = Sale::whereBetween('created_at', [$dateStartOfYear, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $yearlyCreditSales = Sale::whereBetween('created_at', [$dateStartOfYear, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        $dailyPurchases = Purchase::whereDate('created_at', $today)->sum('total_price');
        $dailyCashPurchases = Purchase::whereDate('created_at', $today)->where('payment_method', 'cash')->sum('total_price');
        $dailyAccountPurchases = Purchase::whereDate('created_at', $today)->where('payment_method', 'account')->sum('total_price');
        $dailyCreditPurchases = Purchase::whereDate('created_at', $today)->where('payment_method', 'credit')->sum('total_price');

        $weeklyPurchases = Purchase::whereBetween('created_at', [$dateSevenDaysAgo, $tomorrow])->sum('total_price');
        $weeklyCashPurchases = Purchase::whereBetween('created_at', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $weeklyAccountPurchases = Purchase::whereBetween('created_at', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $weeklyCreditPurchases = Purchase::whereBetween('created_at', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        $monthlyPurchases = Purchase::whereBetween('created_at', [$dateStartOfMonth, $tomorrow])->sum('total_price');
        $monthlyCashPurchases = Purchase::whereBetween('created_at', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $monthlyAccountPurchases = Purchase::whereBetween('created_at', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $monthlyCreditPurchases = Purchase::whereBetween('created_at', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        $yearlyPurchases = Purchase::whereBetween('created_at', [$dateStartOfYear, $tomorrow])->sum('total_price');
        $yearlyCashPurchases = Purchase::whereBetween('created_at', [$dateStartOfYear, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $yearlyAccountPurchases = Purchase::whereBetween('created_at', [$dateStartOfYear, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $yearlyCreditPurchases = Purchase::whereBetween('created_at', [$dateStartOfYear, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        $dailyProfit = $dailySales - $dailyPurchases;
        $weeklyProfit = $weeklySales - $weeklyPurchases;
        $monthlyProfit = $monthlySales - $monthlyPurchases;
        $yearlyProfit = $yearlySales - $yearlyPurchases;

        return Inertia::render('Dashboard/Dashboard', [
            'dailySales' => $dailySales,
            'dailyCashSales' => $dailyCashSales,
            'dailyAccountSales' => $dailyAccountSales,
            'dailyCreditSales' => $dailyCreditSales,


            'weeklySales' => $weeklySales,
            'weeklyCashSales' => $weeklyCashSales,
            'weeklyAccountSales' => $weeklyAccountSales,
            'weeklyCreditSales' => $weeklyCreditSales,


            'monthlySales' => $monthlySales,
            'monthlyCashSales' => $monthlyCashSales,
            'monthlyAccountSales' => $monthlyAccountSales,
            'monthlyCreditSales' => $monthlyCreditSales,

            'yearlySales' => $yearlySales,
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
