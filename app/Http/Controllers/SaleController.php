<?php

namespace App\Http\Controllers;

use App\Helpers\WeightHelper;
use App\Http\Resources\SaleResource;
use App\Models\Sale;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with(['customer', 'product'])->get();

        return Inertia::render('Sales/Index', [
            'sales' => SaleResource::collection($sales),
        ]);
    }

    public function create()
    {
        $customers = Customer::all();
        $products = Product::all();

        $products = $products->map(function ($product) {
            $soldWeight = Sale::where('product_id', $product->id)->sum('weight');
            $availableWeight = $product->weight - $soldWeight;
            $product->available_weight_kg = WeightHelper::toKilos($availableWeight);
            return $product;
        });

        $sales = Sale::all();

        return Inertia::render('Sales/Create', [
            'customers' => $customers,
            'products' => $products,
            'sales' => SaleResource::collection($sales)->resolve(),
        ]);
    }



    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'productWeights' => 'required|array',
            'productWeights.*.product_id' => 'required|exists:products,id',
            'productWeights.*.weight' => 'required|numeric|min:1',
        ]);

        $sales = [];
        foreach ($request->productWeights as $productWeight) {
            $product = Product::find($productWeight['product_id']);
            $total_price = $product->price * $productWeight['weight'];

            $product->update([
                'weight' => $product->weight - WeightHelper::toGrams($productWeight['weight']),
            ]);

            $sales[] = Sale::create([
                'customer_id' => $request->customer_id,
                'product_id' => $productWeight['product_id'],
                'weight' => WeightHelper::toKilos($productWeight['weight']),
                'total_price' => $total_price,
            ]);
        }

        return redirect()->route('sales.index')->with('success', 'Sales created successfully.');
    }

    public function edit(Sale $sale)
    {
        $customers = Customer::all();
        $products = Product::all();
        return Inertia::render('Sales/Edit', [
            'sale' => $sale,
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    public function update(Request $request, Sale $sale)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'weight' => 'required|integer|min:1',
        ]);

        $product = Product::find($request->product_id);

        $total_price = $product->price * WeightHelper::toKilos($request->weight);

        $sale->update([
            'customer_id' => $request->customer_id,
            'product_id' => $request->product_id,
            'weight' => $request->weight,
            'total_price' => $total_price,
        ]);

        return redirect()->route('sales.index')->with('success', 'Sale updated successfully.');
    }

    public function destroy(Sale $sale)
    {
        $sale->delete();

        return redirect()->route('sales.index')->with('success', 'Sale deleted successfully.');
    }
}
