<?php

namespace App\Helpers;

class WeightHelper
{
    /**
     * Convert weight from kilograms to grams.
     *
     * @param int $kilograms
     * @return int
     */
    public static function toGrams(int $kilograms): int
    {
        return $kilograms * 1000;
    }

    /**
     * Convert weight from grams to kilograms.
     *
     * @param int $grams
     * @return int
     */
    public static function toKilos(int $grams): int
    {
        return $grams / 1000;
    }
}
