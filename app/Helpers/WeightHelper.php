<?php

namespace App\Helpers;

class WeightHelper
{
    /**
     * Convert weight from kilograms to grams.
     *
     * @param float $kilograms
     * @return float
     */
    public static function toGrams(float $kilograms): float
    {
        return $kilograms * 1000;
    }

    /**
     * Convert weight from grams to kilograms.
     *
     * @param float $grams
     * @return float
     */
    public static function toKilos(float $grams): float
    {
        return $grams / 1000;
    }
}
