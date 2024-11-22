<?php

namespace App\Http\Resources;

use App\Helpers\WeightHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $customerOldBalance = $this->calculateSupplierOldBalance();

        $data = [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'customer_old_balance' => $customerOldBalance,
            'account' => new AccountResource($this->whenLoaded('account')),
            'total_price' => $this->total_price,
            'sale_date' => $this->sale_date,
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
            'product_items' => $this->relationLoaded('productSales') && $this->productSales
                ? ProductSaleResource::collection($this->productSales)->resolve()
                : [],
        ];

        if ($this->relationLoaded('customer') && $this->customer) {
            $data['customer'] = SupplierResource::make($this->customer)->resolve();
        }

        if ($this->relationLoaded('productSales') && $this->productSales) {
            $data['product_items'] = ProductSaleResource::collection($this->productSales)->resolve();
        }

        if ($this->relationLoaded('account') && $this->account) {
            $data['account'] = AccountResource::make($this->account)->resolve();
        }

        return $data;
    }

    private function calculateSupplierOldBalance(): float|int
    {
        if (!$this->relationLoaded('customer') || !$this->customer) {
            return 0;
        }

        $customerSales = $this->customer->sales()
            ->where('id', '!=', $this->id)
            ->where('remaining_balance', '>', 0)
            ->get();

        return $customerSales->sum('remaining_balance');
    }


}
