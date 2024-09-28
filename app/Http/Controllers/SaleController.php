<?php

namespace App\Http\Controllers;

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
        // Retrieve all sales with their associated customer and product
        $sales = Sale::with(['customer', 'product'])->get();
        return Inertia::render('Sales/Index', [
            'sales' => SaleResource::collection($sales),
        ]);
    }

    public function create()
    {
        // Retrieve all customers and products for the form
        $customers = Customer::all();
        $products = Product::all();
        return Inertia::render('Sales/Create', [
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'weight' => 'required|integer|min:1',
        ]);

        // Calculate the total price based on product weight and stock
        $product = Product::find($request->product_id);
        $total_price = ($product->weight / $product->stock) * $request->weight;

        // Create a new sale record
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

        // Calculate the total price based on product weight and stock
        $product = Product::find($request->product_id);
        $total_price = ($product->weight / $product->stock) * $request->weight;

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
