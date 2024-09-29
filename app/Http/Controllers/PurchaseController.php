<?php

namespace App\Http\Controllers;

use App\Enums\ProductTypeEnum;
use App\Helpers\WeightHelper;
use App\Http\Resources\PurchaseResource;
use App\Models\Product;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = Purchase::with('product')->get();

        return Inertia::render('Purchases/Index', [
            'purchases' => PurchaseResource::collection($purchases),
        ]);
    }


    public function create()
    {
        $products = Product::all();

        return Inertia::render('Purchases/Create', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'price' => 'required|integer',
            'quantity' => 'nullable|integer',
            'weight' => 'nullable|integer',
        ]);

        $product = Product::findOrFail($request->product_id);
        $type = $product->product_type;

        $totalPrice = $type === ProductTypeEnum::WEIGHT->value && $request->weight !== 0
            ? $request->price * $request->weight
            : ($request->weight !== 0 ? $request->price * $request->quantity : 0);

        Purchase::create([
            'product_id' => $request->product_id,
            'type' => $type,
            'single_price' => $request->price,
            'total_price' => $totalPrice,
            'weight' => $type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toGrams($request->weight) : null,
            'quantity' => $type === ProductTypeEnum::ITEM->value ? $request->quantity : null,
        ]);

        // Update the product's quantity or weight accordingly
        if ($type === ProductTypeEnum::ITEM->value) {
            $product->increment('quantity', $request->quantity);
        } else {
            $product->increment('weight', WeightHelper::toGrams($request->weight));
        }

        return redirect()->route('purchases.index');
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
