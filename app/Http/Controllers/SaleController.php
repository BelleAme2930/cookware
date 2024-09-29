<?php

namespace App\Http\Controllers;

use App\Enums\PaymentMethodEnum;
use App\Enums\ProductTypeEnum;
use App\Helpers\WeightHelper;
use App\Http\Resources\SaleResource;
use App\Models\Account;
use App\Models\Sale;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;
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
        $accounts = Account::all();
        $products = Product::with('sales')->get(['id', 'name', 'product_type']);

        return Inertia::render('Sales/Create', [
            'customers' => $customers,
            'products' => $products,
            'accounts' => $accounts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.product_type' => 'required|string',
            'products.*.quantity' => 'nullable|integer',
            'products.*.weight' => 'nullable|numeric',
            'due_date' => 'required|date',
            'payment_method' => 'required|string',
            'account_id' => 'nullable|exists:accounts,id',
        ]);

        foreach ($validated['products'] as $productData) {
            $product = Product::find($productData['product_id']);

            $quantity = $product->product_type === ProductTypeEnum::ITEM->value ? $productData['quantity'] : null;
            $weight = $product->product_type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toGrams($productData['weight']) : null;

            Sale::create([
                'customer_id' => $validated['customer_id'],
                'product_id' => $productData['product_id'],
                'quantity' => $quantity,
                'weight' => $weight,
                'total_price' => $this->calculateTotalPrice($productData, $product->product_type),
                'due_date' => $validated['due_date'],
                'payment_method' => $validated['payment_method'],
                'account_id' => $validated['payment_method'] === PaymentMethodEnum::ACCOUNT->value ? $validated['account_id'] : null,
            ]);

            if ($product->product_type === ProductTypeEnum::ITEM->value) {
                $product->update([
                    'quantity' => $product->quantity - $quantity,
                ]);
            } else {
                $product->update([
                    'weight' => $product->weight - $weight,
                ]);
            }

        }

        return redirect()->route('sales.index')->with('success', 'Sale added successfully');
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
