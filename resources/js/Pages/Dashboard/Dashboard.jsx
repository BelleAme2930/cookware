import React, {useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Head} from '@inertiajs/react';
import ShadowBox from "@/Components/ShadowBox.jsx";
import SelectPeriod from "@/Pages/Dashboard/Partials/SelectPeriod.jsx";
import PurchasesWidget from "@/Pages/Dashboard/Purchases/PurchasesWidget.jsx";
import SalesWidget from "@/Pages/Dashboard/Sales/SalesWidget.jsx";
import ProfitWidget from "@/Pages/Dashboard/Profit/ProfitWidget.jsx";
import ExpensesWidget from "@/Pages/Dashboard/Expenses/ExpensesWidget.jsx";
import {router} from "@inertiajs/core";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import IconButton from "@/Components/IconButton.jsx";
import SupplierLedger from "@/Pages/Dashboard/SupplierLedger.jsx";
import CustomerLedger from "@/Pages/Dashboard/CustomerLedger.jsx";

export default function Dashboard({
                                      daily_purchases_sum,
                                      daily_purchases_cash_sum,
                                      daily_purchases_credit_sum,
                                      daily_purchases_cheque_sum,
                                      daily_purchases_account_sum,
                                      daily_sales_sum,
                                      daily_sales_cash_sum,
                                      daily_sales_credit_sum,
                                      daily_sales_cheque_sum,
                                      daily_sales_account_sum,

                                      weekly_purchases_sum,
                                      weekly_purchases_cash_sum,
                                      weekly_purchases_credit_sum,
                                      weekly_purchases_cheque_sum,
                                      weekly_purchases_account_sum,
                                      weekly_sales_sum,
                                      weekly_sales_cash_sum,
                                      weekly_sales_credit_sum,
                                      weekly_sales_cheque_sum,
                                      weekly_sales_account_sum,

                                      monthly_purchases_sum,
                                      monthly_purchases_cash_sum,
                                      monthly_purchases_credit_sum,
                                      monthly_purchases_cheque_sum,
                                      monthly_purchases_account_sum,
                                      monthly_sales_sum,
                                      monthly_sales_cash_sum,
                                      monthly_sales_credit_sum,
                                      monthly_sales_cheque_sum,
                                      monthly_sales_account_sum,

                                      yearly_purchases_sum,
                                      yearly_purchases_cash_sum,
                                      yearly_purchases_credit_sum,
                                      yearly_purchases_cheque_sum,
                                      yearly_purchases_account_sum,
                                      yearly_sales_sum,
                                      yearly_sales_cash_sum,
                                      yearly_sales_credit_sum,
                                      yearly_sales_cheque_sum,
                                      yearly_sales_account_sum,

                                      daily_profit,
                                      weekly_profit,
                                      monthly_profit,
                                      yearly_profit,

                                      daily_expenses_sum,
                                      weekly_expenses_sum,
                                      monthly_expenses_sum,
                                      yearly_expenses_sum,

                                      todays_receivables,
                                      todays_payables,

                                      suppliers_ledgers,
                                      customers_ledgers,
                                  }) {
    const [selectedPeriod, setSelectedPeriod] = useState('daily');

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    const purchasesData = {
        daily: {
            totalPurchases: daily_purchases_sum,
            accountPurchases: daily_purchases_account_sum,
            cashPurchases: daily_purchases_cash_sum,
            creditPurchases: daily_purchases_credit_sum,
            chequePurchases: daily_purchases_cheque_sum,
        },
        weekly: {
            totalPurchases: weekly_purchases_sum,
            accountPurchases: weekly_purchases_account_sum,
            cashPurchases: weekly_purchases_cash_sum,
            creditPurchases: weekly_purchases_credit_sum,
            chequePurchases: weekly_purchases_cheque_sum,
        },
        monthly: {
            totalPurchases: monthly_purchases_sum,
            accountPurchases: monthly_purchases_account_sum,
            cashPurchases: monthly_purchases_cash_sum,
            creditPurchases: monthly_purchases_credit_sum,
            chequePurchases: monthly_purchases_cheque_sum,
        },
        yearly: {
            totalPurchases: yearly_purchases_sum,
            accountPurchases: yearly_purchases_account_sum,
            cashPurchases: yearly_purchases_cash_sum,
            creditPurchases: yearly_purchases_credit_sum,
            chequePurchases: yearly_purchases_cheque_sum,
        }
    };

    const salesData = {
        daily: {
            totalSales: daily_sales_sum,
            accountSales: daily_sales_account_sum,
            cashSales: daily_sales_cash_sum,
            creditSales: daily_sales_credit_sum,
            chequeSales: daily_sales_cheque_sum,
        },
        weekly: {
            totalSales: weekly_sales_sum,
            accountSales: weekly_sales_account_sum,
            cashSales: weekly_sales_cash_sum,
            creditSales: weekly_sales_credit_sum,
            chequeSales: weekly_sales_cheque_sum,
        },
        monthly: {
            totalSales: monthly_sales_sum,
            accountSales: monthly_sales_account_sum,
            cashSales: monthly_sales_cash_sum,
            creditSales: monthly_sales_credit_sum,
            chequeSales: monthly_sales_cheque_sum,
        },
        yearly: {
            totalSales: yearly_sales_sum,
            accountSales: yearly_sales_account_sum,
            cashSales: yearly_sales_cash_sum,
            creditSales: yearly_sales_credit_sum,
            chequeSales: yearly_sales_cheque_sum,
        }
    };

    const profitData = {
        daily: daily_profit,
        weekly: weekly_profit,
        monthly: monthly_profit,
        yearly: yearly_profit,
    };

    const expensesData = {
        daily: daily_expenses_sum,
        weekly: weekly_expenses_sum,
        monthly: monthly_expenses_sum,
        yearly: yearly_expenses_sum,
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
                                    <h3 className='font-normal text-gray-700 text-2xl'>Purchases</h3>
                                </div>
                                <PurchasesWidget purchasesData={purchasesData} selectedPeriod={selectedPeriod}/>
                            </ShadowBox>
                        </div>
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

                    <div className='flex justify-between gap-3 mt-4 w-full'>
                        <SupplierLedger suppliers_ledgers={suppliers_ledgers}/>
                    </div>

                    <div className='flex justify-between gap-3 mt-4 w-full'>
                        <CustomerLedger customers_ledgers={customers_ledgers}/>
                    </div>

                    <div className='flex justify-between gap-2 mt-4'>
                        <div className='w-1/2'>
                            {todays_receivables.length > 0 ? (
                                <ShadowBox>
                                    <div className='flex justify-between items-center mb-6'>
                                        <h3 className='font-normal text-gray-700 text-xl'>Today's Receivables</h3>
                                    </div>

                                    <div className='space-y-4'>
                                        {todays_receivables.map((receivable) => (
                                            <div key={receivable.id}
                                                 className='p-4 bg-gray-50 rounded-lg shadow-md'>
                                                <div className='flex justify-between items-center'>
                                                    <div>
                                                        <h4 className='font-semibold text-gray-700'>{receivable.customer.name}</h4>
                                                    </div>
                                                    <IconButton
                                                        onClick={() => router.visit(route('sales.show', receivable.id))}
                                                        icon={faEye} className='w-7 h-7'
                                                    />
                                                </div>
                                                <div className='flex mt-4 justify-between'>
                                                    <div className='text-sm text-gray-500 font-medium'><strong>Remaining
                                                        Balance:</strong> {receivable.remaining_balance} Rs
                                                    </div>
                                                    <div className='text-sm text-gray-500 font-medium'><strong>Sale
                                                        Date:</strong> {receivable.sale_date}</div>
                                                </div>
                                                <div className='flex mt-2 justify-between'>
                                                    <div className='text-sm text-gray-500 font-medium'><strong>Payment
                                                        Methods:</strong> <span
                                                        className='capitalize'>{JSON.parse(receivable.payment_method).join(', ')}</span>
                                                    </div>
                                                    {receivable.customer.phone && (
                                                        <div className='text-sm text-gray-500 font-medium'><strong>Customer
                                                            Phone:</strong> {receivable.customer.phone}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ShadowBox>
                            ) : (
                                <ShadowBox>
                                    <div className='flex justify-between items-center mb-6'>
                                        <h3 className='font-normal text-gray-700 text-xl'>Today's Receivables</h3>
                                    </div>
                                    <div className='py-2 text-primary-500 text-center'>No data found</div>
                                </ShadowBox>
                            )}
                        </div>
                        <div className='w-1/2'>
                            {todays_payables.length > 0 ? (
                                <ShadowBox>
                                    <div className='flex justify-between items-center mb-6'>
                                        <h3 className='font-normal text-gray-700 text-xl'>Today's Payables</h3>
                                    </div>

                                    <div className='space-y-4'>
                                        {todays_payables.map((receivable) => (
                                            <div key={receivable.id}
                                                 className='p-4 bg-gray-50 rounded-lg shadow-md'>
                                                <div className='flex justify-between items-center'>
                                                    <div>
                                                        <h4 className='font-semibold text-gray-700'>{receivable.supplier.name}</h4>
                                                    </div>
                                                    <IconButton
                                                        onClick={() => router.visit(route('sales.show', receivable.id))}
                                                        icon={faEye} className='w-7 h-7'
                                                    />
                                                </div>
                                                <div className='flex mt-4 justify-between'>
                                                    <div className='text-sm text-gray-500 font-medium'><strong>Remaining
                                                        Balance:</strong> {receivable.remaining_balance} Rs
                                                    </div>
                                                    <div className='text-sm text-gray-500 font-medium'><strong>Sale
                                                        Date:</strong> {receivable.purchase_date}</div>
                                                </div>
                                                <div className='flex mt-2 justify-between'>
                                                    <div className='text-sm text-gray-500 font-medium'><strong>Payment
                                                        Methods:</strong> <span
                                                        className='capitalize'>{JSON.parse(receivable.payment_method).join(', ')}</span>
                                                    </div>
                                                    {receivable.supplier.phone && (
                                                        <div className='text-sm text-gray-500 font-medium'><strong>Supplier
                                                            Phone:</strong> {receivable.supplier.phone}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ShadowBox>
                            ) : (
                                <ShadowBox>
                                    <div className='flex justify-between items-center mb-6'>
                                        <h3 className='font-normal text-gray-700 text-xl'>Today's Receivables</h3>
                                    </div>
                                    <div className='py-2 text-primary-500 text-center'>No data found</div>
                                </ShadowBox>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
