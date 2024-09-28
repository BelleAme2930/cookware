<?php

namespace App\Http\Controllers;

use App\Helpers\WeightHelper;
use App\Models\SalesTransaction;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Http\Request;

class SalesTransactionController extends Controller
{
    public function index()
    {
        // Retrieve transactions with associated customer and product
        $transactions = SalesTransaction::with(['customer', 'product'])->get();

        // Return Inertia response
        return inertia('Sales/Index', [
            'transactions' => $transactions,
        ]);
    }

    public function create()
    {
        $customers = Customer::all();
        $products = Product::all();
        return inertia('Sales/Create', [
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    public function edit($id)
    {
        $transaction = SalesTransaction::findOrFail($id);
        $customers = Customer::all();
        $products = Product::all();
        return inertia('Sales/Edit', [
            'transaction' => $transaction,
            'customers' => $customers,
            'products' => $products,
        ]);
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0',
        ]);

        $transaction = SalesTransaction::findOrFail($id);
        $quantityInGrams = convertToGrams($request->quantity); // Convert kg to grams
        $total_price = $quantityInGrams * $transaction->product->price;

        $transaction->update([
            'customer_id' => $request->customer_id,
            'product_id' => $request->product_id,
            'quantity' => $quantityInGrams,
            'total_price' => $total_price,
        ]);

        return redirect()->route('sales.index')->with('success', 'Transaction updated successfully.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0',
        ]);

        $quantityInGrams = WeightHelper::toGrams($request->quantity);
        $product = Product::findOrFail($request->product_id);
        $total_price = $quantityInGrams * $product->price;

        SalesTransaction::create([
            'customer_id' => $request->customer_id,
            'product_id' => $request->product_id,
            'quantity' => $quantityInGrams,
            'total_price' => $total_price,
        ]);

        return redirect()->route('sales.index')->with('success', 'Transaction created successfully.');
    }
}
