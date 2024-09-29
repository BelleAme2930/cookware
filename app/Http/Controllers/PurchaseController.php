<?php

namespace App\Http\Controllers;

use App\Enums\ProductTypeEnum;
use App\Helpers\WeightHelper;
use App\Http\Resources\PurchaseResource;
use App\Models\Account;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
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
            'products' => $products,
            'suppliers' => $suppliers,
            'accounts' => $accounts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.product_type' => 'required|string', // Added for product type
            'products.*.quantity' => 'nullable|integer|min:1',
            'products.*.weight' => 'nullable|numeric|min:0',
            'due_date' => 'required|date',
            'payment_method' => 'required|string',
            'account_id' => 'nullable|exists:accounts,id',
        ]);

        // Create a new purchase entry
        $purchase = Purchase::create([
            'supplier_id' => $validated['supplier_id'],
            'total_price' => 0,
            'due_date' => $validated['due_date'],
            'payment_method' => $validated['payment_method'],
            'account_id' => $validated['payment_method'] === 'account' ? $validated['account_id'] : null,
        ]);

        $totalPrice = 0;

        // Loop through each product in the purchase
        foreach ($validated['products'] as $productData) {
            $product = Product::find($productData['product_id']);

            // Handle quantities and weights based on product type
            $quantity = $product->product_type === ProductTypeEnum::ITEM->value ? $productData['quantity'] : null;
            $weight = $product->product_type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toGrams($productData['weight']) : null;

            // Add product to the purchase using the pivot table
            $purchase->products()->attach($product->id, [
                'quantity' => $quantity,
                'weight' => $weight,
                'total_price' => $this->calculateTotalPrice($productData, $product->product_type),
            ]);

            // Update total price
            $totalPrice += $this->calculateTotalPrice($productData, $product->product_type);

            // Update product stock accordingly
            if ($product->product_type === ProductTypeEnum::ITEM->value) {
                $product->update([
                    'quantity' => $product->quantity + $quantity, // Assuming stock increases on purchase
                ]);
            } else {
                $product->update([
                    'weight' => $product->weight + $weight, // Assuming stock increases on purchase
                ]);
            }
        }

        // Update the total price for the purchase
        $purchase->update(['total_price' => $totalPrice]);

        return redirect()->route('purchases.index')->with('success', 'Purchase created successfully.');
    }

    private function calculateTotalPrice($productData, $productType)
    {
        $product = Product::find($productData['product_id']);

        if ($productType === ProductTypeEnum::ITEM->value) {
            return ($product->price * $productData['quantity']);
        } elseif ($productType === ProductTypeEnum::WEIGHT->value) {
            return ($product->price * $productData['weight']);
        }

        return 0;
    }



    public function edit(Purchase $purchase)
    {
        return Inertia::render('Purchases/Edit', [
            'purchase' => $purchase,
        ]);
    }

    public function update(Request $request, Purchase $purchase)
    {
        $request->validate([
            'type' => 'required|string|in:weight,item',
            'price' => 'required|integer',
            'quantity' => 'nullable|integer',
            'weight' => 'nullable|integer',
        ]);

        $purchase->update([
            'type' => $request->type,
            'single_price' => $request->price,
            'quantity' => $request->type === 'item' ? $request->quantity : null,
            'weight' => $request->type === 'weight' ? WeightHelper::toGrams($request->weight) : null,
        ]);

        $product = $purchase->product;

        if ($request->type === ProductTypeEnum::ITEM->value) {
            $product->increment('quantity', $request->quantity);
        } else {
            $product->increment('weight', WeightHelper::toGrams($request->weight));
        }

        return redirect()->route('purchases.index');
    }

    public function destroy(Purchase $purchase)
    {
        $purchase->delete();
        return redirect()->route('purchases.index');
    }
}
