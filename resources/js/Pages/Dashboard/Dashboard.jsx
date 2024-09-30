import React, {useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Head} from '@inertiajs/react';
import SalesWidget from "@/Pages/Dashboard/Sales/SalesWidget.jsx";
import ShadowBox from "@/Components/ShadowBox.jsx";
import SelectPeriod from "@/Pages/Dashboard/Partials/SelectPeriod.jsx";
import PurchasesWidget from "@/Pages/Dashboard/Purchases/PurchasesWidget.jsx";
import Stocks from "@/Pages/Dashboard/Stocks/Stocks.jsx";

export default function Dashboard({
                                      categories,
                                      dailySales,
                                      dailyCashSales,
                                      dailyAccountSales,
                                      dailyCreditSales,
                                      weeklySales,
                                      weeklyCashSales,
                                      weeklyAccountSales,
                                      weeklyCreditSales,
                                      monthlySales,
                                      monthlyCashSales,
                                      monthlyAccountSales,
                                      monthlyCreditSales,
                                      yearlySales,
                                      yearlyCashSales,
                                      yearlyAccountSales,
                                      yearlyCreditSales,
                                      dailyPurchases,
                                      dailyCashPurchases,
                                      dailyAccountPurchases,
                                      dailyCreditPurchases,
                                      weeklyPurchases,
                                      weeklyCashPurchases,
                                      weeklyAccountPurchases,
                                      weeklyCreditPurchases,
                                      monthlyPurchases,
                                      monthlyCashPurchases,
                                      monthlyAccountPurchases,
                                      monthlyCreditPurchases,
                                      yearlyPurchases,
                                      yearlyCashPurchases,
                                      yearlyAccountPurchases,
                                      yearlyCreditPurchases,
                                  }) {
    console.log(categories)
    const [selectedSalesPeriod, setSelectedSalesPeriod] = useState('daily');
    const [selectedPurchasesPeriod, setSelectedPurchasesPeriod] = useState('daily');

    const handleSalesPeriodChange = (event) => {
        setSelectedSalesPeriod(event.target.value);
    };

    const handlePurchasesPeriodChange = (event) => {
        setSelectedPurchasesPeriod(event.target.value);
    };


    const salesData = {
        daily: {
            totalSales: dailySales,
            cashSales: dailyCashSales,
            accountSales: dailyAccountSales,
            creditSales: dailyCreditSales,
        },
        weekly: {
            totalSales: weeklySales,
            cashSales: weeklyCashSales,
            accountSales: weeklyAccountSales,
            creditSales: weeklyCreditSales,
        },
        monthly: {
            totalSales: monthlySales,
            cashSales: monthlyCashSales,
            accountSales: monthlyAccountSales,
            creditSales: monthlyCreditSales,
        },
        yearly: {
            totalSales: yearlySales,
            cashSales: yearlyCashSales,
            accountSales: yearlyAccountSales,
            creditSales: yearlyCreditSales,
        },
    };

    // Purchases data structure
    const purchasesData = {
        daily: {
            totalPurchases: dailyPurchases,
            cashPurchases: dailyCashPurchases,
            accountPurchases: dailyAccountPurchases,
            creditPurchases: dailyCreditPurchases,
        },
        weekly: {
            totalPurchases: weeklyPurchases,
            cashPurchases: weeklyCashPurchases,
            accountPurchases: weeklyAccountPurchases,
            creditPurchases: weeklyCreditPurchases,
        },
        monthly: {
            totalPurchases: monthlyPurchases,
            cashPurchases: monthlyCashPurchases,
            accountPurchases: monthlyAccountPurchases,
            creditPurchases: monthlyCreditPurchases,
        },
        yearly: {
            totalPurchases: yearlyPurchases,
            cashPurchases: yearlyCashPurchases,
            accountPurchases: yearlyAccountPurchases,
            creditPurchases: yearlyCreditPurchases,
        },
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard"/>

            <div className="mx-auto max-w-[90%] p-3">
                <div className='flex items-center justify-between gap-2'>
                    <div className='w-1/2'>
                        <ShadowBox>
                            <div className='flex justify-between items-center mb-6'>
                                <h3 className='font-normal text-gray-700 text-2xl'>Sales</h3>
                                <SelectPeriod
                                    selectedPeriod={selectedSalesPeriod}
                                    onChange={handleSalesPeriodChange}
                                />
                            </div>
                            <SalesWidget salesData={salesData} selectedPeriod={selectedSalesPeriod}/>
                        </ShadowBox>
                    </div>
                    <div className='w-1/2'>
                        <ShadowBox>
                            <div className='flex justify-between items-center mb-6'>
                                <h3 className='font-normal text-gray-700 text-2xl'>Purchases</h3>
                                <SelectPeriod
                                    selectedPeriod={selectedPurchasesPeriod}
                                    onChange={handlePurchasesPeriodChange}
                                />
                            </div>
                            <PurchasesWidget purchasesData={purchasesData} selectedPeriod={selectedPurchasesPeriod}/>
                        </ShadowBox>
                    </div>
                </div>
            </div>

            <div className='mx-auto max-w-[90%] p-3'>
            <Stocks categories={categories}/>
            </div>
        </AuthenticatedLayout>
    );
}
