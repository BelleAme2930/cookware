<?php

namespace App\Enums;

enum PaymentMethodEnum: string {
    case CASH = 'cash';
    case ACCOUNT = 'account';
    case HALF_CASH_HALF_ACCOUNT = 'half_cash_half_account';
    case CREDIT = 'credit';
    case HALF_CASH_HALF_CREDIT = 'half_cash_half_credit';
    case HALF_ACCOUNT_HALF_CREDIT = 'half_account_half_credit';
}
