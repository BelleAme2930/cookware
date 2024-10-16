<?php

namespace App\Helpers;

class WeightHelper
{
    /**
     * Convert weight from kilograms to grams.
     *
     * @param int|float $kilograms
     * @return int
     */
    public static function toGrams(int|float $kilograms): int
    {
        return $kilograms * 1000;
    }

    /**
     * Convert weight from grams to kilograms.
     *
     * @param int $grams
     * @return float|int
     */
    public static function toKilos(int $grams): float|int
    {
        return $grams / 1000;
    }
}
