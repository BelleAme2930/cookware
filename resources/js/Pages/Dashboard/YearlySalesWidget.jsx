import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faCreditCard, faHandHoldingUsd, faCoins } from '@fortawesome/free-solid-svg-icons';

export default function YearlySalesWidget({ totalSales, cashSales, accountSales, creditSales }) {
    return (
        <div className="bg-gradient-to-r to-[#614385] from-[#516395] p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1">
            <h3 className="text-xl font-bold text-white mb-3 text-left">Yearly Sales</h3>
            <div className="flex justify-start items-center space-x-4 mb-3">
                <FontAwesomeIcon icon={faCoins} className="text-white text-2xl" />
                <div className="text-2xl font-extrabold text-white">
                    PKR {totalSales}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-4 bg-white px-4 py-3 rounded-lg shadow">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500 text-3xl" />
                    <div className="text-sm font-semibold">
                        <span className="block text-gray-800">Cash Sale</span>
                        <span className="block text-gray-500">PKR {cashSales}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-4 bg-white px-4 py-3 rounded-lg shadow">
                    <FontAwesomeIcon icon={faCreditCard} className="text-blue-500 text-3xl" />
                    <div className="text-sm font-semibold">
                        <span className="block text-gray-800">Account Sale</span>
                        <span className="block text-gray-500">PKR {accountSales}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-4 bg-white px-4 py-3 rounded-lg shadow">
                    <FontAwesomeIcon icon={faHandHoldingUsd} className="text-yellow-500 text-3xl" />
                    <div className="text-sm font-semibold">
                        <span className="block text-gray-800">Credits</span>
                        <span className="block text-gray-500">PKR {creditSales}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
