<?php

namespace App\Http\Controllers;

use App\Enums\PaymentMethodEnum;
use App\Enums\ProductTypeEnum;
use App\Helpers\WeightHelper;
use App\Http\Requests\StoreSaleRequest;
use App\Http\Requests\UpdateSaleRequest;
use App\Http\Resources\AccountResource;
use App\Http\Resources\CustomerResource;
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
            'sales' => SaleResource::collection($sales)->resolve(),
        ]);
    }

    public function create()
    {
        $customers = Customer::all();
        $accounts = Account::all();
        $products = Product::all();

        return Inertia::render('Sales/Create', [
            'customers' => CustomerResource::collection($customers)->resolve(),
            'products' => ProductResource::collection($products)->resolve(),
            'accounts' => AccountResource::collection($accounts)->resolve(),
        ]);
    }

    public function store(StoreSaleRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            $sale = Sale::create([
                'customer_id' => $validated['customer_id'],
                'payment_method' => $validated['payment_method'],
                'total_price' => 0,
                'sale_date' => Carbon::today(),
                'account_id' => $validated['payment_method'] === PaymentMethodEnum::ACCOUNT->value ? $validated['account_id'] : null,
            ]);

            if ($validated['payment_method'] === PaymentMethodEnum::CREDIT->value ||
                $validated['payment_method'] === PaymentMethodEnum::HALF_ACCOUNT_HALF_CREDIT->value ||
                $validated['payment_method'] === PaymentMethodEnum::HALF_CASH_HALF_CREDIT->value) {
                $sale->update([
                    'due_date' => $validated['due_date'],
                ]);
            }

            $totalPrice = 0;

            foreach ($validated['products'] as $productData) {
                $product = Product::find($productData['product_id']);
                $productType = $product->product_type;
                $weightPerItem = WeightHelper::toKilos($product->weight_per_item);

                $quantity = 0;
                $weight = 0;

                if ($productType === ProductTypeEnum::WEIGHT->value) {
                    $quantity = $productData['weight'] / $weightPerItem;
                    $weight = $productData['weight'];
                    $totalPrice += ($productData['sale_price'] * $weight);
                } else {
                    $quantity = $productData['quantity'];
                    $weight = $productData['quantity'] * $weightPerItem;
                    $totalPrice += ($productData['sale_price'] * $quantity);
                }

                $sale->products()->attach($product->id, [
                    'quantity' => $quantity,
                    'weight' => WeightHelper::toGrams($weight),
                    'sale_price' => $productData['sale_price'],
                ]);

                $product->decrement('quantity', $quantity);
                $product->decrement('weight', WeightHelper::toGrams($weight));
            }

            $sale->update([
                'total_price' => $totalPrice,
            ]);

            switch ($validated['payment_method']) {
                case PaymentMethodEnum::ACCOUNT->value:
                case PaymentMethodEnum::CASH->value:
                case PaymentMethodEnum::HALF_CASH_HALF_ACCOUNT->value:
                    $sale->update([
                        'amount_received' => 0,
                        'remaining_balance' => 0,
                    ]);
                    break;
                case PaymentMethodEnum::CREDIT->value:
                    $sale->update([
                        'amount_received' => $totalPrice,
                        'remaining_balance' => $totalPrice,
                    ]);
                    break;
                case PaymentMethodEnum::HALF_ACCOUNT_HALF_CREDIT->value:
                case PaymentMethodEnum::HALF_CASH_HALF_CREDIT->value:
                    $sale->update([
                        'amount_received' => $validated['amount_received'] ?: 0,
                        'remaining_balance' => $validated['amount_received'] ? ($totalPrice - $validated['amount_received']) : 0,
                    ]);
                    break;
            }

            DB::commit();

            return redirect()->route('sales.index')->with('success', 'Sale added successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            info('Error while adding sale: ' . $e->getMessage());

            return redirect()->route('sales.index')->with('error', 'Failed to add sale. Please try again.');
        }
    }


    public function edit(Sale $sale)
    {
        $sale->load(['customer', 'products']);
        $customers = Customer::all();
        $accounts = Account::all();
        $products = Product::all();

        return Inertia::render('Sales/Edit', [
            'sale' => SaleResource::make($sale)->resolve(),
            'customers' => CustomerResource::collection($customers)->resolve(),
            'products' => ProductResource::collection($products)->resolve(),
            'accounts' => AccountResource::collection($accounts)->resolve(),
        ]);
    }

    public function update(UpdateSaleRequest $request, Sale $sale)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {

            $sale->update([
                'customer_id' => $validated['customer_id'],
                'payment_method' => $validated['payment_method'],
                'account_id' => $validated['payment_method'] === PaymentMethodEnum::ACCOUNT->value ? $validated['account_id'] : null,
            ]);

            if (in_array($validated['payment_method'], [
                PaymentMethodEnum::CREDIT->value,
                PaymentMethodEnum::HALF_ACCOUNT_HALF_CREDIT->value,
                PaymentMethodEnum::HALF_CASH_HALF_CREDIT->value
            ])) {
                $sale->update([
                    'due_date' => $validated['due_date'],
                ]);
            }

            $totalPrice = 0;

            $sale->products()->detach();

            foreach ($validated['products'] as $productData) {
                $product = Product::find($productData['product_id']);
                $productType = $product->product_type;
                $weightPerItem = WeightHelper::toKilos($product->weight_per_item);

                $quantity = 0;
                $weight = 0;

                if ($productType === ProductTypeEnum::WEIGHT->value) {
                    $quantity = $productData['weight'] / $weightPerItem;
                    $weight = $productData['weight'];
                    $totalPrice += ($productData['sale_price'] * $weight);
                } else {
                    $quantity = $productData['quantity'];
                    $weight = $productData['quantity'] * $weightPerItem;
                    $totalPrice += ($productData['sale_price'] * $quantity);
                }

                $sale->products()->attach($product->id, [
                    'quantity' => $quantity,
                    'weight' => WeightHelper::toGrams($weight),
                    'sale_price' => $productData['sale_price'],
                ]);

                $product->decrement('quantity', $quantity);
                $product->decrement('weight', WeightHelper::toGrams($weight));
            }

            $sale->update([
                'total_price' => $totalPrice,
            ]);

            switch ($validated['payment_method']) {
                case PaymentMethodEnum::ACCOUNT->value:
                case PaymentMethodEnum::CASH->value:
                case PaymentMethodEnum::HALF_CASH_HALF_ACCOUNT->value:
                    $sale->update([
                        'amount_received' => 0,
                        'remaining_balance' => 0,
                    ]);
                    break;
                case PaymentMethodEnum::CREDIT->value:
                    $sale->update([
                        'amount_received' => $totalPrice,
                        'remaining_balance' => $totalPrice,
                    ]);
                    break;
                case PaymentMethodEnum::HALF_ACCOUNT_HALF_CREDIT->value:
                case PaymentMethodEnum::HALF_CASH_HALF_CREDIT->value:
                    $sale->update([
                        'amount_received' => $validated['amount_received'] ?: 0,
                        'remaining_balance' => $validated['amount_received'] ? ($totalPrice - $validated['amount_received']) : 0,
                    ]);
                    break;
            }

            DB::commit();

            return redirect()->route('sales.index')->with('success', 'Sale updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            info('Error while updating sale: ' . $e->getMessage());

            return redirect()->route('sales.index')->with('error', 'Failed to update sale. Please try again.');
        }
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
