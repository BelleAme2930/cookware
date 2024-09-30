<?php

namespace App\Http\Controllers;

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

        $dailySales = Sale::whereDate('created_at', $today)->sum('total_price');
        $dailyCashSales = Sale::whereDate('created_at', $today)->where('payment_method', 'cash')->sum('total_price');
        $dailyAccountSales = Sale::whereDate('created_at', $today)->where('payment_method', 'account')->sum('total_price');
        $dailyCredits = Sale::whereDate('created_at', $today)->where('payment_method', 'credit')->sum('total_price');

        $weeklySales = Sale::whereBetween('created_at', [$dateSevenDaysAgo, $tomorrow])->sum('total_price');
        $weeklyCashSales = Sale::whereBetween('created_at', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $weeklyAccountSales = Sale::whereBetween('created_at', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $weeklyCredits = Sale::whereBetween('created_at', [$dateSevenDaysAgo, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        $monthlySales = Sale::whereBetween('created_at', [$dateStartOfMonth, $tomorrow])->sum('total_price');
        $monthlyCashSales = Sale::whereBetween('created_at', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $monthlyAccountSales = Sale::whereBetween('created_at', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $monthlyCredits = Sale::whereBetween('created_at', [$dateStartOfMonth, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        $yearlySales = Sale::whereBetween('created_at', [$dateStartOfYear, $tomorrow])->sum('total_price');
        $yearlyCashSales = Sale::whereBetween('created_at', [$dateStartOfYear, $tomorrow])->where('payment_method', 'cash')->sum('total_price');
        $yearlyAccountSales = Sale::whereBetween('created_at', [$dateStartOfYear, $tomorrow])->where('payment_method', 'account')->sum('total_price');
        $yearlyCredits = Sale::whereBetween('created_at', [$dateStartOfYear, $tomorrow])->where('payment_method', 'credit')->sum('total_price');

        return Inertia::render('Dashboard/Dashboard', [
            'dailySales' => $dailySales,
            'dailyCashSales' => $dailyCashSales,
            'dailyAccountSales' => $dailyAccountSales,
            'dailyCredits' => $dailyCredits,


            'weeklySales' => $weeklySales,
            'weeklyCashSales' => $weeklyCashSales,
            'weeklyAccountSales' => $weeklyAccountSales,
            'weeklyCredits' => $weeklyCredits,


            'monthlySales' => $monthlySales,
            'monthlyCashSales' => $monthlyCashSales,
            'monthlyAccountSales' => $monthlyAccountSales,
            'monthlyCredits' => $monthlyCredits,

            'yearlySales' => $yearlySales,
            'yearlyCashSales' => $yearlyCashSales,
            'yearlyAccountSales' => $yearlyAccountSales,
            'yearlyCredits' => $yearlyCredits,
        ]);
    }
}
