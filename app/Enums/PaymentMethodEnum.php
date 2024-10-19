<?php

namespace App\Enums;

enum PaymentMethodEnum: string {
    case CASH = 'cash';
    case ACCOUNT = 'account';
    case CREDIT = 'credit';
    case CHEQUE = 'cheque';
    case CASH_ACCOUNT = 'cash_account';
    case CASH_CREDIT = 'cash_credit';
    case CASH_CHEQUE = 'cash_cheque';
    case ACCOUNT_CHEQUE = 'account_cheque';
    case ACCOUNT_CREDIT = 'account_credit';
    case CASH_ACCOUNT_CREDIT = 'cash_account_credit';
    case CASH_CHEQUE_CREDIT = 'cash_cheque_credit';
    case CASH_CHEQUE_ACCOUNT = 'cash_cheque_account';
}
