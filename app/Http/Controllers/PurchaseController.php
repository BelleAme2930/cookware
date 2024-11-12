<?php

namespace App\Http\Controllers;

use App\Enums\PaymentMethodEnum;
use App\Enums\ProductTypeEnum;
use App\Helpers\WeightHelper;
use App\Http\Requests\UpdatePurchaseRequest;
use App\Http\Resources\AccountResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\PurchaseResource;
use App\Http\Resources\SupplierResource;
use App\Models\Account;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = Purchase::with(['productPurchases', 'supplier'])->get();

        return Inertia::render('Purchases/Index', [
            'purchases' => PurchaseResource::collection($purchases)->resolve(),
        ]);
    }

    public function create()
    {
        $accounts = Account::all();
        $suppliers = Supplier::all();
        $products = Product::with('sizes')->get();

        return Inertia::render('Purchases/Create', [
            'products' => ProductResource::collection($products)->resolve(),
            'suppliers' => SupplierResource::collection($suppliers)->resolve(),
            'accounts' => AccountResource::collection($accounts)->resolve(),
        ]);
    }

    public function show(Purchase $purchase)
    {
        $purchase->load(['supplier', 'productPurchases.product', 'productPurchases.productSize', 'account']);

        $products = Product::with(['sizes'])->get();

        return Inertia::render('Purchases/Show', [
            'purchase' => PurchaseResource::make($purchase)->resolve(),
            'products' => ProductResource::collection($products)->resolve(),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'payment_method' => 'required|array|max:3',
            'payment_method.*' => 'required|string|in:cash,account,credit,cheque',
            'total_price' => 'required|numeric|min:1',
            'product_items' => 'required|array|min:1',
            'product_items.*.product_id' => 'required|exists:products,id',
            'product_items.*.weight' => 'nullable|numeric|min:0',
            'product_items.*.quantity' => 'nullable|int|min:0',
            'product_items.*.purchase_price' => 'nullable|integer|min:0',
            'product_items.*.sizes' => 'nullable|array|min:0',
            'product_items.*.sizes.*.value' => 'nullable|int|min:1',
            'product_items.*.sizes.*.weight' => 'nullable|numeric|min:1',
            'product_items.*.sizes.*.quantity' => 'nullable|int|min:1',
            'product_items.*.sizes.*.purchase_price' => 'nullable|integer|min:0',
            'due_date' => 'nullable|date',
            'amount_paid' => 'nullable|numeric|min:1',
            'cheque_date' => 'nullable|date',
            'cheque_number' => 'nullable|string',
            'cheque_bank' => 'nullable|string',
            'cheque_amount' => 'nullable|numeric|min:1',
            'account_id' => 'nullable|exists:accounts,id',
            'account_payment' => 'nullable|numeric|min:1',
        ]);

        try {
            DB::beginTransaction();

            $purchaseData = [
                'supplier_id' => $validatedData['supplier_id'],
                'total_price' => $validatedData['total_price'],
                'purchase_date' => Carbon::today(),
                'payment_method' => json_encode($validatedData['payment_method']),
                'account_id' => $validatedData['account_id'] ?? null,
                'due_date' => $validatedData['due_date'] ?? null,
                'amount_paid' => $validatedData['amount_paid'] ?? 0,
                'cheque_number' => $validatedData['cheque_number'] ?? null,
                'cheque_date' => $validatedData['cheque_date'] ?? null,
                'cheque_bank' => $validatedData['cheque_bank'] ?? null,
                'cheque_amount' => $validatedData['cheque_amount'] ?? 0,
                'account_payment' => $validatedData['account_payment'] ?? 0,
                'remaining_balance' => 0,
            ];

            $purchase = Purchase::create($purchaseData);

            if ($validatedData['total_price'] && $validatedData['amount_paid'] && $validatedData['amount_paid'] > 0) {
                $purchase->update([
                    'remaining_balance' => $validatedData['total_price'] - $validatedData['amount_paid'],
                ]);
            }

            $totalWeight = 0;
            $totalQuantity = 0;
            foreach ($validatedData['product_items'] as $productData) {
                $product = Product::find($productData['product_id']);

                if ($product) {
                    $weight = $productData['weight'] ?? 0;
                    $quantity = $productData['quantity'] ?? 1;

                    // Handle sizes if provided
                    if (!empty($productData['sizes'])) {
                        foreach ($productData['sizes'] as $sizeData) {
                            $sizeWeight = $sizeData['weight'] ?? $weight;
                            $sizeQuantity = $sizeData['quantity'] ?? 1;
                            $sizePurchasePrice = $sizeData['purchase_price'] ?? 0;

                            $purchase->productPurchases()->create([
                                'product_id' => $product->id,
                                'product_size_id' => $sizeData['value'] ?? null,
                                'quantity' => $sizeQuantity,
                                'purchase_price' => $sizePurchasePrice,
                                'weight' => $sizeWeight ? WeightHelper::toGrams($sizeWeight) : null,
                            ]);

                            $totalQuantity += $sizeQuantity;
                            $totalWeight += $sizeWeight ?: 0;
                        }
                    } else {
                        $purchasePrice = $productData['purchase_price'] ?? 0;

                        $purchase->productPurchases()->create([
                            'product_id' => $product->id,
                            'product_size_id' => null,
                            'quantity' => $quantity,
                            'purchase_price' => $purchasePrice,
                            'weight' => $weight ? WeightHelper::toGrams($weight) : null,
                        ]);

                        $totalQuantity += $quantity;
                        $totalWeight += $weight ?: 0;
                    }
                }
            }

            $purchase->update([
                'weight' => WeightHelper::toGrams($totalWeight),
                'quantity' => $totalQuantity,
            ]);

            DB::commit();

            return redirect()->route('purchases.index')->with('success', 'Purchase created successfully.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to create purchase: ' . $e->getMessage()]);
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
        try {
            DB::beginTransaction();

            foreach ($purchase->productPurchases as $productPurchase) {
                $product = $productPurchase->product;

                // Check if the product exists before incrementing
                if ($product) {
                    if ($productPurchase->quantity) {
                        $product->increment('quantity', $productPurchase->quantity);
                    }
                    if ($productPurchase->weight) {
                        $product->increment('weight', $productPurchase->weight);
                    }
                }
            }

            $purchase->delete();

            DB::commit();

            return redirect()->route('purchases.index')->with('success', 'Purchase deleted successfully.');
        } catch (\Exception $e) {
            DB::rollback();

            return back()->withErrors(['error' => 'Failed to delete purchase: ' . $e->getMessage()]);
        }
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
