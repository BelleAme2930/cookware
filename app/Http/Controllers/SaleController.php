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
        return Inertia::render('Sales/Create', [
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'weight' => 'required|integer|min:1',
        ]);

        $product = Product::find($request->product_id);

        $total_price = $product->price_per_kg * WeightHelper::toKilos($request->weight);

        $product->update([
            'weight' => $product->weight - WeightHelper::toGrams($request->weight),
        ]);

        // Create the sale record
        Sale::create([
            'customer_id' => $request->customer_id,
            'product_id' => $request->product_id,
            'weight' => $request->weight,
            'total_price' => $total_price,
        ]);

        return redirect()->route('sales.index')->with('success', 'Sale created successfully.');
    }

    public function edit(Sale $sale)
    {
        // Retrieve all customers and products for the edit form
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
        // Validate the request
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'weight' => 'required|integer|min:1',
        ]);

        // Find the product
        $product = Product::find($request->product_id);

        // Calculate total price based on weight and price_per_kg
        $total_price = $product->price_per_kg * WeightHelper::toKilos($request->weight);

        // Update the existing sale record
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
        // Delete the sale record
        $sale->delete();

        return redirect()->route('sales.index')->with('success', 'Sale deleted successfully.');
    }
}
