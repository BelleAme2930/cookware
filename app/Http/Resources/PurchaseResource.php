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
            'account' => new AccountResource($this->whenLoaded('account')),
            'total_price' => $this->total_price,
            'purchase_date' => $this->purchase_date,
            'payment_method' => json_decode($this->payment_method),
            'due_date' => $this->due_date,
            'amount_paid' => $this->amount_paid,
            'cheque_details' => [
                'cheque_number' => $this->cheque_number,
                'cheque_date' => $this->cheque_date,
                'cheque_bank' => $this->cheque_bank,
                'cheque_amount' => $this->cheque_amount,
            ],
            'account_id' => $this->account_id,
            'account_payment' => $this->account_payment,
            'remaining_balance' => $this->remaining_balance,
            'weight' => WeightHelper::toKilos($this->weight),
            'quantity' => $this->quantity,
            'product_items' => $this->relationLoaded('productPurchases') && $this->productPurchases
                ? ProductPurchaseResource::collection($this->productPurchases)->resolve()
                : [],
        ];

        if ($this->relationLoaded('supplier') && $this->supplier) {
            $data['supplier'] = SupplierResource::make($this->supplier)->resolve();
        }

        if ($this->relationLoaded('productPurchases') && $this->productPurchases) {
            $data['supplier'] = SupplierResource::make($this->supplier)->resolve();
        }

        if ($this->relationLoaded('account') && $this->account) {
            $data['account'] = AccountResource::make($this->account)->resolve();
        }

        return $data;
    }


}
