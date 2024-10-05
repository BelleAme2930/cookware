<?php

namespace App\Http\Controllers;

use App\Enums\PaymentMethodEnum;
use App\Enums\ProductTypeEnum;
use App\Helpers\WeightHelper;
use App\Http\Resources\ProductResource;
use App\Http\Resources\SaleResource;
use App\Models\Account;
use App\Models\Sale;
use App\Models\Product;
use App\Models\Customer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with(['customer', 'products'])->get();
        return Inertia::render('Sales/Index', [
            'sales' => SaleResource::collection($sales),
        ]);
    }

    public function create()
    {
        $customers = Customer::all();
        $accounts = Account::all();
        $products = Product::all();

        return Inertia::render('Sales/Create', [
            'customers' => $customers,
            'products' => ProductResource::collection($products)->resolve(),
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
            'products.*.quantity' => 'nullable|integer|min:0',
            'products.*.weight' => 'nullable|numeric|min:0',
            'products.*.sale_price' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'payment_method' => 'required|string',
            'account_id' => 'nullable|exists:accounts,id',
            'semi_credit_amount' => 'nullable|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $sale = Sale::create([
                'customer_id' => $validated['customer_id'],
                'total_price' => 0,
                'due_date' => $validated['due_date'],
                'sale_date' => Carbon::today(),
                'payment_method' => $validated['payment_method'],
                'account_id' => $validated['payment_method'] === PaymentMethodEnum::ACCOUNT->value ? $validated['account_id'] : null,
            ]);

            $totalPrice = 0;

            foreach ($validated['products'] as $productData) {
                $product = Product::find($productData['product_id']);

                $quantity = $product->product_type === ProductTypeEnum::ITEM->value ? $productData['quantity'] : null;
                $weight = $product->product_type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toGrams($productData['weight']) : null;

                $sale->products()->attach($product->id, [
                    'quantity' => $quantity,
                    'weight' => $weight,
                    'sale_price' => $productData['sale_price'],
                ]);

                if ($product->product_type === ProductTypeEnum::ITEM->value) {
                    $totalPrice += ($productData['sale_price'] * $quantity);
                } elseif ($product->product_type === ProductTypeEnum::WEIGHT->value) {
                    $totalPrice += ($productData['sale_price'] * $productData['weight']);
                }

                if ($product->product_type === ProductTypeEnum::ITEM->value && $quantity) {
                    $product->decrement('quantity', $quantity);
                } elseif ($product->product_type === ProductTypeEnum::WEIGHT->value && $weight) {
                    $product->decrement('weight', $weight);
                }
            }

            $sale->update(['total_price' => $totalPrice]);

            if ($validated['payment_method'] === 'semi_credit') {
                $semiCreditAmount = $validated['semi_credit_amount'] ?? 0;
                $remainingBalance = $totalPrice - $semiCreditAmount;

                $sale->update([
                    'semi_credit_amount' => $semiCreditAmount,
                    'remaining_balance' => $remainingBalance,
                ]);
            }
        });

        return redirect()->route('sales.index')->with('success', 'Sale added successfully');
    }


    public function edit(Sale $sale)
    {
        $sale->load(['customer', 'products']);
        $customers = Customer::all();
        $accounts = Account::all();
        $products = Product::all();

        return Inertia::render('Sales/Edit', [
            'sale' => $sale,
            'customers' => $customers,
            'products' => $products,
            'accounts' => $accounts,
        ]);
    }

    public function update(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.product_type' => 'required|string',
            'products.*.quantity' => 'nullable|integer|min:0',
            'products.*.weight' => 'nullable|numeric|min:0',
            'due_date' => 'required|date',
            'payment_method' => 'required|string',
            'account_id' => 'nullable|exists:accounts,id',
        ]);

        DB::transaction(function () use ($validated, $sale) {
            $sale->products()->detach();

            $sale->update([
                'customer_id' => $validated['customer_id'],
                'due_date' => $validated['due_date'],
                'payment_method' => $validated['payment_method'],
                'account_id' => $validated['payment_method'] === PaymentMethodEnum::ACCOUNT->value ? $validated['account_id'] : null,
            ]);

            $totalPrice = 0;

            foreach ($validated['products'] as $productData) {
                $product = Product::find($productData['product_id']);

                $quantity = $product->product_type === ProductTypeEnum::ITEM->value ? $productData['quantity'] : null;
                $weight = $product->product_type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toGrams($productData['weight']) : null;

                $sale->products()->attach($product->id, [
                    'quantity' => $quantity,
                    'weight' => $weight,
                    'sale_price' => $productData['sale_price'],
                ]);

                if ($product->product_type === ProductTypeEnum::ITEM->value) {
                    $totalPrice += ($productData['sale_price'] * $quantity);
                } elseif ($product->product_type === ProductTypeEnum::WEIGHT->value) {
                    $totalPrice += ($productData['sale_price'] * $weight);
                }

                if ($product->product_type === ProductTypeEnum::ITEM->value && $quantity) {
                    $product->decrement('quantity', $quantity);
                } elseif ($product->product_type === ProductTypeEnum::WEIGHT->value && $weight) {
                    $product->decrement('weight', $weight);
                }
            }

            $sale->update(['total_price' => $totalPrice]);
        });

        return redirect()->route('sales.index')->with('success', 'Sale updated successfully.');
    }

    public function show(Sale $sale)
    {
        $sale->load(['customer', 'products']);

        return Inertia::render('Sales/Show', [
            'sale' => SaleResource::make($sale)->resolve(),
        ]);
    }

    public function destroy(Sale $sale)
    {
        DB::transaction(function () use ($sale) {
            foreach ($sale->products as $product) {
                $sale->products()->detach($product->id);
                if ($product->product_type === ProductTypeEnum::ITEM->value) {
                    $product->increment('quantity', $product->pivot->quantity);
                } elseif ($product->product_type === ProductTypeEnum::WEIGHT->value) {
                    $product->increment('weight', $product->pivot->weight);
                }
            }

            $sale->delete();
        });

        return redirect()->route('sales.index')->with('success', 'Sale deleted successfully.');
    }

}
