<?php

namespace App\Http\Controllers;

use App\Enums\PaymentMethodEnum;
use App\Enums\ProductTypeEnum;
use App\Helpers\WeightHelper;
use App\Http\Resources\AccountResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\PurchaseResource;
use App\Http\Resources\SaleResource;
use App\Http\Resources\SupplierResource;
use App\Models\Account;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = Purchase::with(['products', 'supplier'])->get();

        return Inertia::render('Purchases/Index', [
            'purchases' => PurchaseResource::collection($purchases),
        ]);
    }

    public function create()
    {
        $products = Product::all();
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
        $purchase->load(['supplier', 'products']);

        return Inertia::render('Purchases/Show', [
            'purchase' => PurchaseResource::make($purchase)->resolve(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.product_type' => 'required|string',
            'products.*.quantity' => 'nullable|integer|min:0',
            'products.*.weight' => 'nullable|numeric|min:0',
            'products.*.purchase_price' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'payment_method' => 'required|string',
            'account_id' => 'nullable|exists:accounts,id',
            'semi_credit_amount' => 'nullable|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $purchase = Purchase::create([
                'supplier_id' => $validated['supplier_id'],
                'total_price' => 0,
                'due_date' => $validated['due_date'],
                'purchase_date' => Carbon::today(),
                'payment_method' => $validated['payment_method'],
                'account_id' => $validated['payment_method'] === PaymentMethodEnum::ACCOUNT->value ? $validated['account_id'] : null,
            ]);

            $totalPrice = 0;

            foreach ($validated['products'] as $productData) {
                $product = Product::find($productData['product_id']);

                $quantity = $product->product_type === ProductTypeEnum::ITEM->value ? $productData['quantity'] : null;
                $weight = $product->product_type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toGrams($productData['weight']) : null;

                $purchase->products()->attach($product->id, [
                    'quantity' => $quantity,
                    'weight' => $weight,
                    'purchase_price' => $productData['purchase_price'],
                ]);

                if ($product->product_type === ProductTypeEnum::ITEM->value) {
                    $totalPrice += ($productData['purchase_price'] * $quantity);
                } elseif ($product->product_type === ProductTypeEnum::WEIGHT->value) {
                    $totalPrice += ($productData['purchase_price'] * $productData['weight']);
                }

                // Update product quantity after purchase
                if ($product->product_type === ProductTypeEnum::ITEM->value && $quantity) {
                    $product->increment('quantity', $quantity);
                } elseif ($product->product_type === ProductTypeEnum::WEIGHT->value && $weight) {
                    $product->increment('weight', $weight);
                }
            }

            $purchase->update(['total_price' => $totalPrice]);

            if ($validated['payment_method'] === 'semi_credit') {
                $semiCreditAmount = $validated['semi_credit_amount'] ?? 0;
                $remainingBalance = $totalPrice - $semiCreditAmount;

                $purchase->update([
                    'semi_credit_amount' => $semiCreditAmount,
                    'remaining_balance' => $remainingBalance,
                ]);
            }
        });

        return redirect()->route('purchases.index')->with('success', 'Purchase added successfully');
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

    public function update(Request $request, Purchase $purchase)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.product_type' => 'required|string',
            'products.*.quantity' => 'nullable|integer|min:0',
            'products.*.weight' => 'nullable|numeric|min:0',
            'products.*.purchase_price' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'payment_method' => 'required|string',
            'account_id' => 'nullable|exists:accounts,id',
            'semi_credit_amount' => 'nullable|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $purchase) {
            $purchase->update([
                'supplier_id' => $validated['supplier_id'],
                'due_date' => $validated['due_date'],
                'payment_method' => $validated['payment_method'],
                'account_id' => $validated['payment_method'] === PaymentMethodEnum::ACCOUNT->value ? $validated['account_id'] : null,
            ]);

            $purchase->products()->detach();

            $totalPrice = 0;

            foreach ($validated['products'] as $productData) {
                $product = Product::find($productData['product_id']);

                $quantity = $product->product_type === ProductTypeEnum::ITEM->value ? $productData['quantity'] : null;
                $weight = $product->product_type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toGrams($productData['weight']) : null;

                $purchase->products()->attach($product->id, [
                    'quantity' => $quantity,
                    'weight' => $weight,
                    'purchase_price' => $productData['purchase_price'],
                ]);

                if ($product->product_type === ProductTypeEnum::ITEM->value) {
                    $totalPrice += ($productData['purchase_price'] * $quantity);
                } elseif ($product->product_type === ProductTypeEnum::WEIGHT->value) {
                    $totalPrice += ($productData['purchase_price'] * $productData['weight']);
                }

                if ($product->product_type === ProductTypeEnum::ITEM->value && $quantity) {
                    $product->increment('quantity', $quantity);
                } elseif ($product->product_type === ProductTypeEnum::WEIGHT->value && $weight) {
                    $product->increment('weight', $weight);
                }
            }

            $purchase->update(['total_price' => $totalPrice]);

            if ($validated['payment_method'] === 'semi_credit') {
                $semiCreditAmount = $validated['semi_credit_amount'] ?? 0;
                $remainingBalance = $totalPrice - $semiCreditAmount;

                $purchase->update([
                    'semi_credit_amount' => $semiCreditAmount,
                    'remaining_balance' => $remainingBalance,
                ]);
            }
        });

        return redirect()->route('purchases.index')->with('success', 'Purchase updated successfully');
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
