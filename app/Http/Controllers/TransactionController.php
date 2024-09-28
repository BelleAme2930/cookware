<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Transaction;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with(['customer', 'products'])->get();
        return Inertia::render('Transactions/Index', [
            'transactions' => TransactionResource::collection($transactions),
        ]);
    }

    public function create()
    {
        return Inertia::render('Transactions/Create', [
            'customers' => Customer::all(),
            'products' => Product::all(),
        ]);
    }

    public function store(StoreTransactionRequest $request)
    {
        // Create transaction
        $transaction = Transaction::create([
            'customer_id' => $request->customer_id,
            'total_price' => array_reduce($request->products, function($carry, $product) {
                return $carry + $product['total_price'];
            }, 0),
        ]);

        // Attach products to transaction
        foreach ($request->products as $product) {
            $transaction->products()->attach($product['product_id'], [
                'weight' => $product['weight'],
                'total_price' => $product['total_price'],
            ]);
        }

        return redirect()->route('transactions.index')->with('success', 'Transaction created successfully');
    }

    public function show(Transaction $transaction)
    {
        return Inertia::render('Transactions/Show', [
            'transaction' => new TransactionResource($transaction->load(['customer', 'products'])),
        ]);
    }

    public function edit(Transaction $transaction)
    {
        return Inertia::render('Transactions/Edit', [
            'transaction' => new TransactionResource($transaction->load(['customer', 'products'])),
            'customers' => Customer::all(),
            'products' => Product::all(),
        ]);
    }

    public function update(StoreTransactionRequest $request, Transaction $transaction)
    {
        $transaction->update([
            'customer_id' => $request->customer_id,
            'total_price' => array_reduce($request->products, function($carry, $product) {
                return $carry + $product['total_price'];
            }, 0),
        ]);

        // Sync products
        $transaction->products()->sync(array_map(function($product) {
            return [
                'product_id' => $product['product_id'],
                'weight' => $product['weight'],
                'total_price' => $product['total_price'],
            ];
        }, $request->products));

        return redirect()->route('transactions.index')->with('success', 'Transaction updated successfully');
    }


    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return redirect()->route('transactions.index')->with('success', 'Transaction deleted successfully');
    }
}
