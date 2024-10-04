<?php

namespace App\Modules;

use App\Models\Purchase;
use App\Models\Sale;
use App\Helpers\WeightHelper;

class ProfitCalculator
{
    public function calculateProfit($sales, $dateRange)
    {
        $profit = 0;

        foreach ($sales as $sale) {
            foreach ($sale->products as $product) {
                $purchasePrice = $this->getPurchasePriceForProduct($product->id);
                $salePrice = $product->pivot->sale_price;

                if ($sale->payment_method !== 'credit') {
                    $profitValue = $salePrice - $purchasePrice;

                    if ($product->product_type === 'weight') {
                        $profit += $profitValue * WeightHelper::toKilos($product->pivot->weight);
                    } elseif ($product->product_type === 'item') {
                        $profit += $profitValue * $product->pivot->quantity;
                    }
                }
            }
        }

        return $profit;
    }

    private function getPurchasePriceForProduct($productId)
    {
        $purchase = Purchase::whereHas('products', function($query) use ($productId) {
            $query->where('product_id', $productId);
        })->with('products')->latest()->first();

        if ($purchase) {
            $product = $purchase->products->where('id', $productId)->first();
            return $product->pivot->purchase_price;
        }

        return 0;
    }
}
