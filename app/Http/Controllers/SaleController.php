<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with('customer')->get(); // Eager load customer data
        return Inertia::render('Sales/Index', [
            'sales' => $sales,
        ]);
    }

    public function create()
    {
        $products = Product::all(); // Get all products for sale
        $customers = Customer::all(); // Get all customers for reference
        return Inertia::render('Sales/Create', [
            'products' => $products,
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.weight' => 'required|integer|min:1',
        ]);

        // Calculate total weight and total price
        $totalWeight = 0;
        $totalPrice = 0;

        foreach ($request->products as $product) {
            $prod = Product::find($product['id']);
            $totalWeight += $product['weight'];
            $totalPrice += ($prod->price * $product['weight']) / 1000; // Assuming price is per kg
        }

        // Create the sale record
        Sale::create([
            'customer_id' => $request->customer_id,
            'total_weight' => $totalWeight,
            'total_price' => $totalPrice,
        ]);

        return redirect()->route('sales.index')->with('success', 'Sale recorded successfully!');
    }

    public function show(Sale $sale)
    {
        return Inertia::render('Sales/Show', [
            'sale' => $sale->load('customer'), // Load customer relationship
        ]);
    }

    public function edit(Sale $sale)
    {
        $products = Product::all(); // Get all products for sale
        $customers = Customer::all(); // Get all customers for reference
        return Inertia::render('Sales/Edit', [
            'sale' => $sale,
            'products' => $products,
            'customers' => $customers,
        ]);
    }

    public function update(Request $request, Sale $sale)
    {
        // Similar validation and update logic here...
    }

    public function destroy(Sale $sale)
    {
        $sale->delete();
        return redirect()->route('sales.index')->with('success', 'Sale deleted successfully!');
    }
}
