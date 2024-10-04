<?php

namespace App\Http\Controllers;

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
            'products.*.product_type' => 'required|string|in:item,weight',
            'products.*.quantity' => 'nullable|integer',
            'products.*.weight' => 'nullable|numeric',
            'products.*.price' => 'nullable|numeric',
            'due_date' => 'required|date',
            'payment_method' => 'required|string',
            'account_id' => 'nullable|exists:accounts,id',
        ]);

        $purchase = Purchase::create([
            'supplier_id' => $validated['supplier_id'],
            'total_price' => 0,
            'due_date' => $validated['due_date'],
            'purchase_date' => Carbon::today(),
            'payment_method' => $validated['payment_method'],
            'account_id' => $validated['payment_method'] === 'account' ? $validated['account_id'] : null,
        ]);

        $totalPrice = 0;

        foreach ($validated['products'] as $productData) {
            $product = Product::find($productData['product_id']);

            $quantity = $product->product_type === ProductTypeEnum::ITEM->value ? $productData['quantity'] : null;
            $weight = $product->product_type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toGrams($productData['weight']) : null;

            $purchase->products()->attach($product->id, [
                'quantity' => $quantity,
                'weight' => $weight,
                'purchase_price' => $productData['price'],
            ]);

            $totalPrice += $this->calculatePurchasePrice($productData, $product->product_type);

            if ($product->product_type === ProductTypeEnum::ITEM->value) {
                $product->increment('quantity', $quantity);
            } else {
                $product->increment('weight', $weight);
            }
        }

        $purchase->update(['total_price' => $totalPrice]);

        return redirect()->route('purchases.index')->with('success', 'Purchase created successfully.');
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
            'products.*.product_type' => 'required|string|in:item,weight',
            'products.*.quantity' => 'nullable|integer',
            'products.*.weight' => 'nullable|numeric',
            'products.*.price' => 'nullable|numeric',
            'due_date' => 'required|date',
            'payment_method' => 'required|string',
            'account_id' => 'nullable|exists:accounts,id',
        ]);

        $purchase->update([
            'supplier_id' => $validated['supplier_id'],
            'due_date' => $validated['due_date'],
            'payment_method' => $validated['payment_method'],
            'account_id' => $validated['payment_method'] === 'account' ? $validated['account_id'] : null,
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
                'purchase_price' => $this->calculatePurchasePrice($productData, $product->product_type),
            ]);

            $totalPrice += $this->calculatePurchasePrice($productData, $product->product_type);

            if ($product->product_type === ProductTypeEnum::ITEM->value) {
                $product->increment('quantity', $quantity);
            } else {
                $product->increment('weight', $weight);
            }
        }

        $purchase->update(['total_price' => $totalPrice]);

        return redirect()->route('purchases.index')->with('success', 'Purchase updated successfully.');
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
