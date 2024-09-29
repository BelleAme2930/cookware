<?php

namespace App\Enums;

enum PaymentMethodEnum: string {
    case ACCOUNT = 'account';
    case CASH = 'cash';
}
