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
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with(['productSales', 'customer'])->get();

        return Inertia::render('Sales/Index', [
            'sales' => SaleResource::collection($sales)->resolve(),
        ]);
    }

    public function create()
    {
        $customers = Customer::all();
        $accounts = Account::all();
        $products = Product::with('sizes')->get();

        return Inertia::render('Sales/Create', [
            'customers' => CustomerResource::collection($customers)->resolve(),
            'products' => ProductResource::collection($products)->resolve(),
            'accounts' => AccountResource::collection($accounts)->resolve(),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'payment_method' => 'required|array|max:3',
            'payment_method.*' => 'required|string|in:cash,account,credit,cheque',
            'total_price' => 'required|numeric|min:1',
            'product_items' => 'required|array|min:1',
            'product_items.*.product_id' => 'required|exists:products,id',
            'product_items.*.weight' => 'nullable|numeric|min:0',
            'product_items.*.quantity' => 'nullable|int|min:0',
            'product_items.*.weight_type' => 'nullable|string',
            'product_items.*.sale_price' => 'nullable|integer|min:0',
            'product_items.*.sizes' => 'nullable|array|min:0',
            'product_items.*.sizes.*.value' => 'nullable|int|min:1',
            'product_items.*.sizes.*.weight' => 'nullable|numeric|min:1',
            'product_items.*.sizes.*.quantity' => 'nullable|int|min:1',
            'product_items.*.sizes.*.sale_price' => 'nullable|integer|min:0',
            'due_date' => 'nullable|date',
            'amount_paid' => 'nullable|numeric|min:1',
            'cheque_date' => 'nullable|date',
            'cheque_number' => 'nullable|string',
            'cheque_bank' => 'nullable|string',
            'cheque_amount' => 'nullable|numeric|min:1',
            'account_id' => 'nullable|exists:accounts,id',
            'account_payment' => 'nullable|numeric|min:1',
        ]);

        try {
            DB::beginTransaction();

            $saleData = [
                'customer_id' => $validatedData['customer_id'],
                'total_price' => $validatedData['total_price'],
                'sale_date' => Carbon::today(),
                'payment_method' => json_encode($validatedData['payment_method']),
                'account_id' => $validatedData['account_id'] ?? null,
                'due_date' => $validatedData['due_date'] ?? null,
                'amount_paid' => $validatedData['amount_paid'] ?? 0,
                'cheque_number' => $validatedData['cheque_number'] ?? null,
                'cheque_date' => $validatedData['cheque_date'] ?? null,
                'cheque_bank' => $validatedData['cheque_bank'] ?? null,
                'cheque_amount' => $validatedData['cheque_amount'] ?? 0,
                'account_payment' => $validatedData['account_payment'] ?? 0,
                'remaining_balance' => 0,
            ];

            $sale = Sale::create($saleData);

            if ($validatedData['total_price'] && $validatedData['amount_paid'] && $validatedData['amount_paid'] > 0) {
                $sale->update([
                    'remaining_balance' => $validatedData['total_price'] - $validatedData['amount_paid'],
                ]);
            }

            $customer = Customer::find($validatedData['customer_id']);
            $existingCustomerBalance = $customer->existing_balance;

            if ($validatedData['total_price'] && $validatedData['amount_paid'] && $validatedData['amount_paid'] > 0){
                $customer->update([
                    'existing_balance' => $existingCustomerBalance + ($validatedData['total_price'] - $validatedData['amount_paid']),
                ]);
            }

            $totalWeight = 0;
            $totalQuantity = 0;

            foreach ($validatedData['product_items'] as $productData) {
                $batchId = (string) Str::uuid();
                $product = Product::find($productData['product_id']);
                $productType = $product->product_type;


                if ($productType === ProductTypeEnum::ITEM->value) {
                    if (!empty($productData['sizes'])) {
                        foreach ($productData['sizes'] as $sizeData) {
                            $totalQuantity += $sizeData['quantity'] ?: 0;
                            $sale->productSales()->create([
                                'product_id' => $product->id,
                                'product_size_id' => $sizeData['value'] ?? null,
                                'quantity' => $sizeData['quantity'],
                                'sale_price' => $sizeData['sale_price'],
                                'weight' => null,
                                'batch_id' => $batchId,
                            ]);
                        }
                    } else {
                        $sale->productSales()->create([
                            'product_id' => $product->id,
                            'product_size_id' => null,
                            'quantity' => $productData['quantity'],
                            'sale_price' => $productData['sale_price'],
                            'weight' => null,
                            'batch_id' => $batchId,
                        ]);
                        $totalQuantity += $productData['quantity'] ?: 0;
                    }
                }

                if ($productType === ProductTypeEnum::WEIGHT->value) {
                    $weightType = $productData['weight_type'] ?? 'total';

                    if (!empty($productData['sizes'])) {
                        if ($weightType === 'total') {
                            $totalWeight += $productData['weight'] ?: 0;
                            foreach ($productData['sizes'] as $sizeData) {
                                $sale->productSales()->create([
                                    'product_id' => $product->id,
                                    'product_size_id' => $sizeData['value'],
                                    'quantity' => $sizeData['quantity'],
                                    'sale_price' => $productData['sale_price'],
                                    'weight' => WeightHelper::toGrams($productData['weight']),
                                    'batch_id' => $batchId,
                                ]);
                                $totalQuantity += $sizeData['quantity'] ?: 0;
                            }
                        } else {
                            foreach ($productData['sizes'] as $sizeData) {
                                $sale->productSales()->create([
                                    'product_id' => $product->id,
                                    'product_size_id' => $sizeData['value'],
                                    'quantity' => $sizeData['quantity'],
                                    'sale_price' => $sizeData['sale_price'],
                                    'weight' => WeightHelper::toGrams($sizeData['weight']),
                                    'batch_id' => $batchId,
                                ]);
                                $totalWeight += $sizeData['weight'] ?: 0;
                                $totalQuantity += $sizeData['quantity'] ?: 0;
                            }
                        }
                    } else {
                        $totalWeight += $productData['weight'] ?: 0;
                        $sale->productSales()->create([
                            'product_id' => $product->id,
                            'product_size_id' => null,
                            'quantity' => $productData['quantity'],
                            'sale_price' => $productData['sale_price'],
                            'weight' => WeightHelper::toGrams($productData['weight'] ?? 0) ?? null,
                            'batch_id' => $batchId,
                        ]);
                        $totalQuantity += $productData['quantity'] ?: 0;
                    }
                }
            }

            $sale->update([
                'weight' => WeightHelper::toGrams($totalWeight),
                'quantity' => $totalQuantity,
            ]);

            DB::commit();

            return redirect()->route('sales.index')->with('success', 'Sale created successfully.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to create sale: ' . $e->getMessage()]);
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
        $sale->load(['customer.sales', 'productSales.product', 'productSales.productSize', 'account']);
        $products = Product::with(['sizes'])->get();

        return Inertia::render('Sales/Show', [
            'sale' => SaleResource::make($sale)->resolve(),
            'products' => ProductResource::collection($products)->resolve(),
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
