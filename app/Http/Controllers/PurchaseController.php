<?php

namespace App\Http\Controllers;

use App\Enums\PaymentMethodEnum;
use App\Enums\ProductTypeEnum;
use App\Helpers\WeightHelper;
use App\Http\Requests\StorePurchaseRequest;
use App\Http\Requests\UpdatePurchaseRequest;
use App\Http\Resources\AccountResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\PurchaseResource;
use App\Http\Resources\SupplierResource;
use App\Models\Account;
use App\Models\Product;
use App\Models\ProductSize;
use App\Models\Purchase;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = Purchase::with(['products', 'supplier'])->get();

        return Inertia::render('Purchases/Index', [
            'purchases' => PurchaseResource::collection($purchases)->resolve(),
        ]);
    }

    public function create()
    {
        $products = Product::with(['sizes'])->get();
        $suppliers = Supplier::all();
        $accounts = Account::all();

        return Inertia::render('Purchases/Create', [
            'products' => ProductResource::collection($products)->resolve(),
            'suppliers' => SupplierResource::collection($suppliers)->resolve(),
            'accounts' => AccountResource::collection($accounts)->resolve(),
        ]);
    }

    public function show(Purchase $purchase)
    {
        $purchase->load(['supplier', 'products', 'productSizes']);

        return Inertia::render('Purchases/Show', [
            'purchase' => PurchaseResource::make($purchase)->resolve(),
        ]);
    }

    public function store(StorePurchaseRequest $request)
    {
        $validated = $request->validated();
        DB::beginTransaction();

        try {
            $purchase = Purchase::create([
                'supplier_id' => $validated['supplier_id'],
                'payment_method' => $validated['payment_method'],
                'total_price' => 0,
                'purchase_date' => Carbon::today(),
                'account_id' => in_array($validated['payment_method'], [
                    PaymentMethodEnum::ACCOUNT->value,
                    PaymentMethodEnum::CASH_ACCOUNT->value,
                    PaymentMethodEnum::ACCOUNT_CHEQUE->value,
                    PaymentMethodEnum::ACCOUNT_CREDIT->value,
                    PaymentMethodEnum::CASH_ACCOUNT_CREDIT->value,
                    PaymentMethodEnum::CASH_CHEQUE_ACCOUNT->value,
                ]) ? $validated['account_id'] : null,
            ]);

            // Handle due date for credit-related payment methods
            if (in_array($validated['payment_method'], [
                PaymentMethodEnum::CREDIT->value,
                PaymentMethodEnum::CASH_CREDIT->value,
                PaymentMethodEnum::ACCOUNT_CREDIT->value,
                PaymentMethodEnum::CASH_ACCOUNT_CREDIT->value,
                PaymentMethodEnum::CASH_CHEQUE->value,
                PaymentMethodEnum::ACCOUNT_CHEQUE->value,
                PaymentMethodEnum::CASH_CHEQUE_ACCOUNT->value,
            ])) {
                $purchase->update([
                    'due_date' => $validated['due_date'],
                ]);
            }

            // Handle cheque number if it's included in the payment method
            if (in_array($validated['payment_method'], [
                PaymentMethodEnum::CHEQUE->value,
                PaymentMethodEnum::CASH_CHEQUE->value,
                PaymentMethodEnum::ACCOUNT_CHEQUE->value,
                PaymentMethodEnum::CASH_CHEQUE_ACCOUNT->value,
            ])) {
                $purchase->update([
                    'cheque_number' => $validated['cheque_number'],
                ]);
            }

            $totalPrice = 0;

            foreach ($validated['products'] as $productData) {
                $product = Product::find($productData['product_id']);
                if (!$product) {
                    throw new \Exception("Product not found");
                }

                $productType = $productData['product_type'];
                $totalQuantity = 0;
                $totalWeight = 0;

                if (isset($productData['sizes'])) {
                    foreach ($productData['sizes'] as $sizeId => $sizeData) {
                        $quantity = $sizeData['quantity'];
                        $purchasePrice = $sizeData['purchase_price'];

                        $totalQuantity += $quantity;
                        $totalPrice += $quantity * $purchasePrice;

                        // Update the product size quantity
                        $productSize = ProductSize::where('id', $sizeId)
                            ->where('product_id', $product->id)
                            ->first();

                        if ($productSize) {
                            $productSize->increment('quantity', $quantity);
                        }

                        $purchase->productSizes()->attach($sizeId, [
                            'quantity' => $quantity,
                            'purchase_price' => $purchasePrice,
                        ]);
                    }
                }

                // Handle weight-based products
                if ($productType === ProductTypeEnum::WEIGHT->value && isset($productData['weight'])) {
                    $totalWeight = $productData['weight'];
                }

                // Attach the product to the purchase with appropriate details
                $purchase->products()->attach($product->id, [
                    'quantity' => $totalQuantity,
                    'weight' => WeightHelper::toGrams($totalWeight),
                    'purchase_price' => $totalQuantity > 0 ? $totalPrice / $totalQuantity : 0, // Average price per unit
                ]);

                // Update the product's total quantity and weight
                $product->increment('quantity', $totalQuantity);
                $product->increment('weight', WeightHelper::toGrams($totalWeight));
            }

            // Update the total price of the purchase
            $purchase->update([
                'total_price' => $totalPrice,
            ]);

            // Handle payment calculations based on the payment method
            switch ($validated['payment_method']) {
                case PaymentMethodEnum::CASH->value:
                case PaymentMethodEnum::ACCOUNT->value:
                case PaymentMethodEnum::CASH_ACCOUNT->value:
                    $purchase->update([
                        'amount_paid' => $totalPrice,
                        'remaining_balance' => 0,
                    ]);
                    break;

                case PaymentMethodEnum::CREDIT->value:
                case PaymentMethodEnum::CHEQUE->value:
                    $purchase->update([
                        'amount_paid' => 0,
                        'remaining_balance' => $totalPrice,
                    ]);
                    break;

                case PaymentMethodEnum::CASH_CREDIT->value:
                case PaymentMethodEnum::ACCOUNT_CREDIT->value:
                case PaymentMethodEnum::CASH_ACCOUNT_CREDIT->value:
                case PaymentMethodEnum::CASH_CHEQUE->value:
                case PaymentMethodEnum::ACCOUNT_CHEQUE->value:
                case PaymentMethodEnum::CASH_CHEQUE_ACCOUNT->value:
                    $amountPaid = $validated['amount_paid'] ?? 0;
                    $remainingBalance = $totalPrice - $amountPaid;
                    $purchase->update([
                        'amount_paid' => $amountPaid,
                        'remaining_balance' => $remainingBalance,
                    ]);
                    break;
            }

            DB::commit();

            return redirect()->route('purchases.index')->with('success', 'Purchase added successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            info('Error while adding purchase: ' . $e->getMessage());

            return redirect()->route('purchases.index')->with('error', 'Failed to add purchase. Please try again.');
        }
    }

    public function edit(Purchase $purchase)
    {
        $products = Product::all();
        $suppliers = Supplier::all();
        $accounts = Account::all();
        $purchase->load(['products', 'supplier']);

        return Inertia::render('Purchases/Edit', [
            'purchase' => PurchaseResource::make($purchase)->resolve(),
            'products' => ProductResource::collection($products)->resolve(),
            'suppliers' => SupplierResource::collection($suppliers)->resolve(),
            'accounts' => AccountResource::collection($accounts)->resolve(),
        ]);
    }

    public function update(UpdatePurchaseRequest $request, Purchase $purchase)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {

            foreach ($purchase->products as $oldProduct) {
                $product = Product::find($oldProduct->id);
                $productType = $product->product_type;
                $weightPerItem = WeightHelper::toKilos($product->weight_per_item);

                $oldQuantity = $oldProduct->pivot->quantity;
                $oldWeight = $oldProduct->pivot->weight;

                $product->decrement('quantity', $oldQuantity);
                $product->decrement('weight', $oldWeight);
            }

            $purchase->products()->detach();

            $purchase->update([
                'supplier_id' => $validated['supplier_id'],
                'payment_method' => $validated['payment_method'],
                'account_id' => $validated['payment_method'] === PaymentMethodEnum::ACCOUNT->value ? $validated['account_id'] : null,
                'purchase_date' => $validated['purchase_date'] ?? $purchase->purchase_date,  // Optionally update purchase date
            ]);

            if ($validated['payment_method'] === PaymentMethodEnum::CREDIT->value ||
                $validated['payment_method'] === PaymentMethodEnum::HALF_ACCOUNT_HALF_CREDIT->value ||
                $validated['payment_method'] === PaymentMethodEnum::HALF_CASH_HALF_CREDIT->value) {
                $purchase->update([
                    'due_date' => $validated['due_date'],
                ]);
            } else {
                $purchase->update(['due_date' => null]);
            }

            $totalPrice = 0;

            foreach ($validated['products'] as $productData) {
                $product = Product::find($productData['product_id']);
                $productType = $product->product_type;
                $weightPerItem = WeightHelper::toKilos($product->weight_per_item);

                $quantity = 0;
                $weight = 0;

                if ($productType === ProductTypeEnum::WEIGHT->value) {
                    $quantity = $productData['weight'] / $weightPerItem;
                    $weight = $productData['weight'];
                    $totalPrice += ($productData['purchase_price'] * $weight);
                } else {
                    $quantity = $productData['quantity'];
                    $weight = $productData['quantity'] * $weightPerItem;
                    $totalPrice += ($productData['purchase_price'] * $quantity);
                }

                $purchase->products()->attach($product->id, [
                    'quantity' => $quantity,
                    'weight' => WeightHelper::toGrams($weight),
                    'purchase_price' => $productData['purchase_price'],
                ]);

                $product->increment('quantity', $quantity);
                $product->increment('weight', WeightHelper::toGrams($weight));
            }

            $purchase->update([
                'total_price' => $totalPrice,
            ]);

            switch ($validated['payment_method']) {
                case PaymentMethodEnum::ACCOUNT->value:
                case PaymentMethodEnum::CASH->value:
                case PaymentMethodEnum::HALF_CASH_HALF_ACCOUNT->value:
                    $purchase->update([
                        'amount_paid' => 0,
                        'remaining_balance' => 0,
                    ]);
                    break;
                case PaymentMethodEnum::CREDIT->value:
                    $purchase->update([
                        'amount_paid' => $totalPrice,
                        'remaining_balance' => $totalPrice,
                    ]);
                    break;
                case PaymentMethodEnum::HALF_ACCOUNT_HALF_CREDIT->value:
                case PaymentMethodEnum::HALF_CASH_HALF_CREDIT->value:
                    $purchase->update([
                        'amount_paid' => $validated['amount_paid'] ?: 0,
                        'remaining_balance' => $validated['amount_paid'] ? ($totalPrice - $validated['amount_paid']) : 0,
                    ]);
                    break;
            }

            DB::commit();

            return redirect()->route('purchases.index')->with('success', 'Purchase updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            info('Error while updating purchase: ' . $e->getMessage());

            return redirect()->route('purchases.index')->with('error', 'Failed to update purchase. Please try again.');
        }
    }

    public function destroy(Purchase $purchase)
    {
        foreach ($purchase->products as $existingProduct) {
            if ($existingProduct->pivot->quantity) {
                $existingProduct->increment('quantity', $existingProduct->pivot->quantity);
            }
            if ($existingProduct->pivot->weight) {
                $existingProduct->increment('weight', $existingProduct->pivot->weight);
            }
        }

        $purchase->delete();

        return redirect()->route('purchases.index')->with('success', 'Purchase deleted successfully.');
    }

    private function calculatePurchasePrice($productData, $productType)
    {
        if ($productType === ProductTypeEnum::ITEM->value) {
            return ($productData['price'] * $productData['quantity']);
        } elseif ($productType === ProductTypeEnum::WEIGHT->value) {
            return ($productData['price'] * $productData['weight']);
        }

        return 0;
    }
}
