import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head } from '@inertiajs/react';
import DailySalesWidget from "@/Pages/Dashboard/DailySalesWidget.jsx";
import WeeklySalesWidget from "@/Pages/Dashboard/WeeklySalesWidget.jsx";
import MonthlySalesWidget from "@/Pages/Dashboard/MonthlySalesWidget.jsx";
import YearlySalesWidget from "@/Pages/Dashboard/YearlySalesWidget.jsx";

export default function Dashboard({
                                      dailySales,
                                      dailyCashSales,
                                      dailyAccountSales,
                                      dailyCredits,
                                      weeklySales,
                                      weeklyCashSales,
                                      weeklyAccountSales,
                                      weeklyCredits,
                                      monthlySales,
                                      monthlyCashSales,
                                      monthlyAccountSales,
                                      monthlyCredits,
                                      yearlySales,
                                      yearlyCashSales,
                                      yearlyAccountSales,
                                      yearlyCredits,
                                  }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <DailySalesWidget
                                    totalSales={dailySales}
                                    cashSales={dailyCashSales}
                                    accountSales={dailyAccountSales}
                                    creditSales={dailyCredits}
                                />
                                <WeeklySalesWidget
                                    totalSales={weeklySales}
                                    cashSales={weeklyCashSales}
                                    accountSales={weeklyAccountSales}
                                    creditSales={weeklyCredits}
                                />
                                <MonthlySalesWidget
                                    totalSales={monthlySales}
                                    cashSales={monthlyCashSales}
                                    accountSales={monthlyAccountSales}
                                    creditSales={monthlyCredits}
                                />
                                <YearlySalesWidget
                                    totalSales={yearlySales}
                                    cashSales={yearlyCashSales}
                                    accountSales={yearlyAccountSales}
                                    creditSales={yearlyCredits}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
