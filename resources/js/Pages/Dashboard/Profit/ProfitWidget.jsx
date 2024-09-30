import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function ProfitWidget({ profitData, selectedPeriod }) {
    const profit = profitData[selectedPeriod];

    const isProfitPositive = profit >= 0;

    return (
        <div className={`p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1 bg-gradient-to-r ${isProfitPositive ? 'from-green-300 to-green-500' : 'from-red-400 to-red-500'}`}>
            <h3 className="text-xl font-bold text-white mb-3">Profit Overview</h3>

            <div className="flex justify-start items-center space-x-4 mb-3">
                <FontAwesomeIcon
                    icon={faDollarSign}
                    className="text-white text-2xl"
                />
                <div className="text-2xl font-extrabold text-white">
                    {isProfitPositive ? '+' : '-'} PKR {Math.abs(profit)}
                </div>
            </div>

            <div className="flex items-center space-x-4 text-white">
                <FontAwesomeIcon
                    icon={isProfitPositive ? faArrowUp : faArrowDown}
                    className={`text-3xl ${isProfitPositive ? 'text-green-200' : 'text-red-200'}`}
                />
                <span className="text-sm font-semibold">
                    {isProfitPositive ? 'Profit' : 'Loss'} for {selectedPeriod}
                </span>
            </div>
        </div>
    );
}
