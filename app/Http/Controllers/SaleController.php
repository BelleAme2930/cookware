<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    // 1. Index Method - Lists all sales
    public function index()
    {
        // Fetch sales from the database (you can paginate if needed)
        $sales = Sale::with('customer', 'products')->get();

        // Return a view with sales data
        return inertia('Sales/Index', [
            'sales' => $sales,
        ]);
    }

    // 2. Create Method - Shows the form to create a new sale
    public function create()
    {
        // Fetch customers and products for the form
        $customers = Customer::all();
        $products = Product::all();

        // Return a view with customers and products data
        return inertia('Sales/Create', [
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    // 3. Store Method - Saves a new sale to the database
    public function store(Request $request)
    {
        // Validation rules
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.weight' => 'required|numeric|min:0.001',
        ]);

        // Save the sale to the database
        $sale = Sale::create([
            'customer_id' => $validated['customer_id'],
        ]);

        // Attach the products and their weights (convert weight to grams if needed)
        foreach ($validated['products'] as $product) {
            $sale->products()->attach($product['id'], ['weight' => $product['weight'] * 1000]); // Save in grams
        }

        return redirect()->route('sales.index');
    }

    // 4. Edit Method - Shows the form to edit a sale
    public function edit(Sale $sale)
    {
        $customers = Customer::all();
        $products = Product::all();

        // Pass the sale data along with customers and products
        return inertia('Sales/Edit', [
            'sale' => $sale->load('products'),
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    // 5. Update Method - Updates a sale
    public function update(Request $request, Sale $sale)
    {
        // Similar validation rules as store method
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.weight' => 'required|numeric|min:0.001',
        ]);

        // Update the sale customer
        $sale->update([
            'customer_id' => $validated['customer_id'],
        ]);

        // Sync the products and their weights
        $sale->products()->sync([]);
        foreach ($validated['products'] as $product) {
            $sale->products()->attach($product['id'], ['weight' => $product['weight'] * 1000]); // Save in grams
        }

        return redirect()->route('sales.index');
    }
}
