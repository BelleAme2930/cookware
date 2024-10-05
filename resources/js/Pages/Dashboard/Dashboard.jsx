import React, {useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Head} from '@inertiajs/react';
import SalesWidget from "@/Pages/Dashboard/Sales/SalesWidget.jsx";
import ShadowBox from "@/Components/ShadowBox.jsx";
import SelectPeriod from "@/Pages/Dashboard/Partials/SelectPeriod.jsx";
import PurchasesWidget from "@/Pages/Dashboard/Purchases/PurchasesWidget.jsx";
import Stocks from "@/Pages/Dashboard/Stocks/Stocks.jsx";
import ProfitWidget from "@/Pages/Dashboard/Profit/ProfitWidget.jsx";
import ExpensesWidget from "@/Pages/Dashboard/Expenses/ExpensesWidget.jsx";
import Receivables from "@/Pages/Dashboard/Receivables/Receivables.jsx";
import Payables from "@/Pages/Dashboard/Payables/Payables.jsx";

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
                                      dailyProfit,
                                      weeklyProfit,
                                      monthlyProfit,
                                      yearlyProfit,
                                      dailyExpenses,
                                      weeklyExpenses,
                                      monthlyExpenses,
                                      yearlyExpenses,
                                      dailySemiCreditSales,
                                      weeklySemiCreditSales,
                                      monthlySemiCreditSales,
                                      yearlySemiCreditSales,
                                      dailySemiCreditPurchases,
                                      weeklySemiCreditPurchases,
                                      monthlySemiCreditPurchases,
                                      yearlySemiCreditPurchases,
                                      todayReceivables,
                                      todayPayables,
                                  }) {
    const [selectedPeriod, setSelectedPeriod] = useState('daily');

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    const salesData = {
        daily: {
            totalSales: dailySales,
            cashSales: dailyCashSales,
            accountSales: dailyAccountSales,
            creditSales: dailyCreditSales,
            semiCreditSales: dailySemiCreditSales,
        },
        weekly: {
            totalSales: weeklySales,
            cashSales: weeklyCashSales,
            accountSales: weeklyAccountSales,
            creditSales: weeklyCreditSales,
            semiCreditSales: weeklySemiCreditSales,
        },
        monthly: {
            totalSales: monthlySales,
            cashSales: monthlyCashSales,
            accountSales: monthlyAccountSales,
            creditSales: monthlyCreditSales,
            semiCreditSales: monthlySemiCreditSales,
        },
        yearly: {
            totalSales: yearlySales,
            cashSales: yearlyCashSales,
            accountSales: yearlyAccountSales,
            creditSales: yearlyCreditSales,
            semiCreditSales: yearlySemiCreditSales,
        },
    };

    const purchasesData = {
        daily: {
            totalPurchases: dailyPurchases,
            cashPurchases: dailyCashPurchases,
            accountPurchases: dailyAccountPurchases,
            creditPurchases: dailyCreditPurchases,
            semiCreditPurchases: dailySemiCreditPurchases,
        },
        weekly: {
            totalPurchases: weeklyPurchases,
            cashPurchases: weeklyCashPurchases,
            accountPurchases: weeklyAccountPurchases,
            creditPurchases: weeklyCreditPurchases,
            semiCreditPurchases: weeklySemiCreditPurchases,

        },
        monthly: {
            totalPurchases: monthlyPurchases,
            cashPurchases: monthlyCashPurchases,
            accountPurchases: monthlyAccountPurchases,
            creditPurchases: monthlyCreditPurchases,
            semiCreditPurchases: monthlySemiCreditPurchases,
        },
        yearly: {
            totalPurchases: yearlyPurchases,
            cashPurchases: yearlyCashPurchases,
            accountPurchases: yearlyAccountPurchases,
            creditPurchases: yearlyCreditPurchases,
            semiCreditPurchases: yearlySemiCreditPurchases,
        },
    };

    const profitData = {
        daily: dailyProfit,
        weekly: weeklyProfit,
        monthly: monthlyProfit,
        yearly: yearlyProfit,
    };

    const expensesData = {
        daily: dailyExpenses,
        weekly: weeklyExpenses,
        monthly: monthlyExpenses,
        yearly: yearlyExpenses,
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

            <div className="mx-auto max-w-[98%] p-3">
                <div>
                    <div className='flex justify-end mb-3'>
                        <SelectPeriod
                            selectedPeriod={selectedPeriod}
                            onChange={handlePeriodChange}
                        />
                    </div>
                    <div className='flex justify-between gap-2'>
                        <div className='w-1/3'>
                            <ShadowBox>
                                <div className='flex justify-between items-center mb-6'>
                                    <h3 className='font-normal text-gray-700 text-2xl'>Sales</h3>
                                </div>
                                <SalesWidget salesData={salesData} selectedPeriod={selectedPeriod}/>
                            </ShadowBox>
                        </div>
                        <div className='w-1/3'>
                            <ShadowBox>
                                <div className='flex justify-between items-center mb-6'>
                                    <h3 className='font-normal text-gray-700 text-2xl'>Purchases</h3>
                                </div>
                                <PurchasesWidget purchasesData={purchasesData} selectedPeriod={selectedPeriod}/>
                            </ShadowBox>
                        </div>
                        <div className='w-1/3'>
                            <ShadowBox>
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-normal text-gray-700 text-2xl">Profit</h3>
                                    </div>
                                    <ProfitWidget profitData={profitData} selectedPeriod={selectedPeriod}/>
                                </div>
                                <hr className='mt-7 mb-6 border-red-500'/>
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-normal text-gray-700 text-2xl">Expenses</h3>
                                    </div>
                                    <ExpensesWidget expensesData={expensesData}
                                                    selectedPeriod={selectedPeriod}/>
                                </div>
                            </ShadowBox>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mx-auto max-w-[98%] p-3'>
                <Stocks categories={categories}/>
            </div>
            <div className='mx-auto max-w-[98%] p-3'>
                <Receivables receivables={todayReceivables}/>
            </div>
            <div className='mx-auto max-w-[98%] p-3'>
                <Payables payables={todayPayables}/>
            </div>
        </AuthenticatedLayout>
    );
}
