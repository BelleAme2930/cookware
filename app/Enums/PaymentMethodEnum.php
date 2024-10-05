<?php

namespace App\Enums;

enum PaymentMethodEnum: string {
    case ACCOUNT = 'account';
    case CASH = 'cash';
    case CREDIT = 'credit';
    case SEMI_CREDIT = 'semi_credit';
}
