import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMoneyBillWave, faCreditCard, faHandHoldingUsd, faCoins, faMoneyBill} from '@fortawesome/free-solid-svg-icons';
import {Link} from "@inertiajs/react";

export default function PurchasesWidget({ purchasesData, selectedPeriod }) {
    const purchases = purchasesData[selectedPeriod];

    return (
        <div className="bg-gradient-to-r to-[#de6262] from-[#ffb88c] p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1">
            <h3 className="text-xl font-bold text-white mb-3 text-left">Purchases Overview</h3>

            <div className="flex justify-start items-center space-x-4 mb-3">
                <FontAwesomeIcon icon={faCoins} className="text-white text-2xl" />
                <div className="text-2xl font-extrabold text-white">
                    {(parseInt(purchases.totalPurchases)).toLocaleString()} Rs
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Link href={route('purchases.byType', 'cash')} className="flex items-center space-x-4 bg-white px-4 py-3 rounded-lg shadow hover:shadow-xl transition-all">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500 text-3xl"/>
                    <div className="text-sm font-semibold">
                        <span className="block text-gray-800">Cash Purchase</span>
                        <span className="block text-gray-500">{parseInt(purchases.cashPurchases).toLocaleString()} Rs</span>
                    </div>
                </Link>

                <Link href={route('purchases.byType', 'account')} className="flex items-center space-x-4 bg-white px-4 py-3 rounded-lg shadow hover:shadow-xl transition-all">
                    <FontAwesomeIcon icon={faCreditCard} className="text-blue-500 text-3xl"/>
                    <div className="text-sm font-semibold">
                        <span className="block text-gray-800">Account Purchase</span>
                        <span className="block text-gray-500">{parseInt(purchases.accountPurchases).toLocaleString()} Rs</span>
                    </div>
                </Link>

                <Link href={route('purchases.byType', 'credit')} className="flex items-center space-x-4 bg-white px-4 py-3 rounded-lg shadow hover:shadow-xl transition-all">
                    <FontAwesomeIcon icon={faHandHoldingUsd} className="text-yellow-500 text-3xl"/>
                    <div className="text-sm font-semibold">
                        <span className="block text-gray-800">Credit Purchase</span>
                        <span className="block text-gray-500">{parseInt(purchases.creditPurchases).toLocaleString()} Rs</span>
                    </div>
                </Link>

                <Link href={route('purchases.byType', 'cheque')} className="flex items-center space-x-4 bg-white px-4 py-3 rounded-lg shadow hover:shadow-xl transition-all">
                    <FontAwesomeIcon icon={faMoneyBill} className="text-red-500 text-3xl"/>
                    <div className="text-sm font-semibold">
                        <span className="block text-gray-800">Cheque Purchase</span>
                        <span className="block text-gray-500">{parseInt(purchases.chequePurchases).toLocaleString()} Rs</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
