<?php

namespace App\Http\Resources;

use App\Helpers\WeightHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'supplier_id' => $this->supplier_id,
            'account_id' => $this->account_id,
            'total_price' => $this->total_price,
            'amount_paid' => $this->amount_paid,
            'remaining_balance' => $this->remaining_balance,
            'due_date' => $this->due_date,
            'weight' => WeightHelper::toKilos($this->weight),
            'quantity' => $this->quantity,
            'payment_method' => $this->getFormattedPaymentMethods($this->payment_method),
            'cheque_number' => $this->cheque_number,
            'purchase_date' => $this->purchase_date,
            'account_payment' => $this->account_payment,
        ];

        if ($this->relationLoaded('supplier')) {
            $data['supplier'] = SupplierResource::make($this->supplier)->resolve();
        }

        if ($this->relationLoaded('account') && $this->account) {
            $data['account'] = AccountResource::make($this->account)->resolve();
        }

        if ($this->relationLoaded('productPurchases')) {
            $data['product_purchases'] = $this->formatProductPurchases($this->productPurchases);
        }

        return $data;
    }

    /**
     * Format the product purchases to the desired structure.
     *
     * @param $productPurchases
     * @return array
     */
    private function formatProductPurchases($productPurchases): array
    {
        $formattedPurchases = [];

        foreach ($productPurchases as $productPurchase) {
            $productId = $productPurchase->product_id;

            if (!isset($formattedPurchases[$productId])) {
                $product = $productPurchase->product;
                $formattedPurchases[$productId] = [
                    'name' => $product ? $product->name : '-',
                    'total_price' => 0,
                    'sizes' => [],
                    'product_type' => $product->product_type,
                    'weight' => 0,
                ];
            }

            $productSize = $productPurchase->productSize;

            $formattedPurchases[$productId]['total_price'] += $productPurchase->purchase_price * $productPurchase->quantity;

            $formattedPurchases[$productId]['sizes'][] = [
                'size' => $productSize ? $productSize->size : 'Unknown Size',
                'quantity' => $productPurchase->quantity,
                'weight' => $productPurchase->weight ? WeightHelper::toKilos($productPurchase->weight) : null,
                'purchase_price' => $productPurchase->purchase_price,
                'separate_weight' => (bool)$productPurchase->separate_weight,
            ];

            if ($productPurchase->weight) {
                $formattedPurchases[$productId]['weight'] += WeightHelper::toKilos($productPurchase->weight);
            }

        }

        return $formattedPurchases;
    }

    private function getFormattedPaymentMethods(string $paymentMethodsJson): string
    {
        $methodMap = [
            'cash' => 'Cash',
            'account' => 'Account',
            'credit' => 'Credit',
            'cheque' => 'Cheque',
        ];

        $paymentMethods = json_decode($paymentMethodsJson, true);

        $formattedMethods = array_map(function ($method) use ($methodMap) {
            return $methodMap[$method] ?? 'Unknown Payment Method';
        }, $paymentMethods);

        // Join the formatted payment methods into a single string
        return implode(', ', $formattedMethods);
    }
}
