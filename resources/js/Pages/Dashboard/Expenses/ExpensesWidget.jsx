import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function ExpensesWidget({ expensesData, selectedPeriod }) {
    const expenses = expensesData[selectedPeriod];

    const isExpensesPositive = expenses >= 0;

    return (
        <div className={`p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1 bg-gradient-to-r ${isExpensesPositive ? 'from-blue-300 to-blue-500' : 'from-red-400 to-red-500'}`}>
            <h3 className="text-xl font-bold text-white mb-3">Expenses Overview</h3>

            <div className="flex justify-start items-center space-x-4 mb-3">
                <FontAwesomeIcon
                    icon={faDollarSign}
                    className="text-white text-2xl"
                />
                <div className="text-2xl font-extrabold text-white">
                    {isExpensesPositive ? '-' : '+'} PKR {Math.abs(expenses)}
                </div>
            </div>

            <div className="flex items-center space-x-4 text-white">
                <FontAwesomeIcon
                    icon={isExpensesPositive ? faArrowDown : faArrowUp}
                    className={`text-3xl ${isExpensesPositive ? 'text-blue-200' : 'text-red-200'}`}
                />
                <span className="text-sm font-semibold">
                    {isExpensesPositive ? 'Expenses' : 'Savings'} for {selectedPeriod}
                </span>
            </div>
        </div>
    );
}
